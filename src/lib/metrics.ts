// T-0133 product metrics: measured business SLOs computed from real rows in
// bounded windows. Every rate is a plain SQL aggregate over the production
// tables (no sampling, no estimation); windows with zero eligible rows return
// null ("insufficient data") instead of a fake 100%. Used by the SLO probe
// suite (scripts/t0123-slo-probes.mjs) so business SLOs are measured on the
// same 15-minute cadence and land in the same journald/Kestra evidence path.

export interface BusinessMetrics {
  window_days: number;
  booking_success_rate: number | null;
  booking_denominator: number;
  matching_success_rate: number | null;
  matching_denominator: number;
  notification_delivery_rate: number | null;
  notification_denominator: number;
  computed_at: string;
}

export function computeBusinessMetrics(
  db: {
    prepare: (sql: string) => { get: (...args: unknown[]) => any };
  },
  now: Date = new Date(),
  windowDays = 30,
): BusinessMetrics {
  const since = new Date(now.getTime() - windowDays * 24 * 3600 * 1000).toISOString();

  // Booking success: confirmed or completed appointments vs all appointments
  // created in the window (cancelled/no_show/expired count against the SLO).
  const booking = db.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN status IN ('confirmed','completed') THEN 1 ELSE 0 END) AS good
       FROM appointments WHERE created_at >= ?`,
  ).get(since) as { total: number; good: number | null };

  // Matching success: dispatches that reached quote/acceptance or closed after
  // acceptance vs all dispatches in the window (declined/expired count against).
  const matching = db.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN status IN ('quoted','accepted','closed') THEN 1 ELSE 0 END) AS good
       FROM job_dispatches WHERE sent_at >= ?`,
  ).get(since) as { total: number; good: number | null };

  // Notification delivery: channel receipts that were sent vs all finalized
  // receipts in the window (failed/dead count against). Pending rows that have
  // no receipt yet are excluded — they are in-flight, not failed.
  const delivery = db.prepare(
    `SELECT COUNT(*) AS total,
            SUM(CASE WHEN state = 'sent' THEN 1 ELSE 0 END) AS good
       FROM notification_receipts WHERE created_at >= ?`,
  ).get(since) as { total: number; good: number | null };

  const rate = (good: number | null, total: number): number | null =>
    total > 0 ? (good ?? 0) / total : null;

  return {
    window_days: windowDays,
    booking_success_rate: rate(booking.good, booking.total),
    booking_denominator: booking.total,
    matching_success_rate: rate(matching.good, matching.total),
    matching_denominator: matching.total,
    notification_delivery_rate: rate(delivery.good, delivery.total),
    notification_denominator: delivery.total,
    computed_at: now.toISOString(),
  };
}
