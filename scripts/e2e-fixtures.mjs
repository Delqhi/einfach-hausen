/**
 * Deterministic product fixtures for isolated browser and integration tests.
 * The caller owns the SQLite connection and must point it at a disposable DB.
 */
export function createE2EFixture(db, { namespace = 'default' } = {}) {
  const key = String(namespace).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'default';
  const email = (role) => `fixture-${key}-${role}@example.test`;
  const insertUser = db.prepare(`INSERT INTO users(email,password_hash,role,first_name,last_name,phone) VALUES(?,?,?,?,?,?)`);
  const userId = (role, firstName, lastName, phone = null) => {
    const existing = db.prepare('SELECT id FROM users WHERE email=?').get(email(role));
    if (existing) return Number(existing.id);
    const accountRole = role === 'contact' ? 'provider' : role;
    return Number(insertUser.run(email(role), 'fixture-password-hash', accountRole, firstName, lastName, phone).lastInsertRowid);
  };

  return db.transaction(() => {
    const homeownerId = userId('homeowner', 'Fixture', 'Eigentümer');
    const providerId = userId('provider', 'Fixture', 'Partner', '+49 000 000000');
    const contactId = userId('contact', 'Fixture', 'Kontakt', '+49 000 000001');
    db.prepare(`INSERT OR IGNORE INTO homeowner_profiles(user_id,postcode,address,onboarding_step) VALUES(?,?,?, 'done')`)
      .run(homeownerId, '46325', 'Fixturestraße 1, 46325 Borken');
    db.prepare(`INSERT OR IGNORE INTO provider_profiles(user_id,business_name,trades,postcode,verified,description) VALUES(?,?,?,?,1,?)`)
      .run(providerId, `Fixture Partner ${key}`, 'Garten, Hausmeister', '46325', 'Deterministic E2E provider');
    db.prepare(`INSERT OR IGNORE INTO provider_members(provider_id,user_id,job_title,can_manage_jobs,active) VALUES(?,?,?,1,1)`)
      .run(providerId, contactId, 'Ansprechpartner');
    db.prepare(`INSERT OR IGNORE INTO provider_preferences(provider_id,accepts_normal_jobs,instant_booking) VALUES(?,1,1)`).run(providerId);
    db.prepare(`INSERT INTO partner_contracts(provider_id,status,commission_bps,insurance_verified,qualification_verified,contract_verified,quality_standard_verified)
      VALUES(?, 'active', 0, 1, 1, 1, 1) ON CONFLICT(provider_id) DO UPDATE SET status='active',commission_bps=0,
      insurance_verified=1,qualification_verified=1,contract_verified=1,quality_standard_verified=1`)
      .run(providerId);

    const property = db.prepare(`INSERT INTO properties(address,postcode,property_type,build_year,living_area,plot_area)
      VALUES(?,?,?,?,?,?)`).run('Fixturestraße 1, 46325 Borken', '46325', 'Einfamilienhaus', 2001, 140, 600);
    const propertyId = Number(property.lastInsertRowid);
    db.prepare(`INSERT INTO property_ownerships(property_id,homeowner_id,active) VALUES(?,?,1)`).run(propertyId, homeownerId);
    const asset = db.prepare(`INSERT INTO house_assets(homeowner_id,property_id,kind,name,details,installed_year) VALUES(?,?,?,?,?,?)`)
      .run(homeownerId, propertyId, 'heating', 'Fixture Wärmepumpe', 'Testgerät', 2024);
    const assetId = Number(asset.lastInsertRowid);
    db.prepare(`INSERT INTO maintenance_tasks(homeowner_id,property_id,asset_id,title,category,due_date,status) VALUES(?,?,?,?,?,date('now','+30 day'),'open')`)
      .run(homeownerId, propertyId, assetId, 'Fixture Wartung', 'Heizung');
    const job = db.prepare(`INSERT INTO jobs(homeowner_id,property_id,title,description,category,postcode,status,request_kind,service_slug)
      VALUES(?,?,?,?,?,'46325','accepted','service','hausmeister')`)
      .run(homeownerId, propertyId, `Fixture Auftrag ${key}`, 'Deterministic fixture request', 'Hausmeister');
    const jobId = Number(job.lastInsertRowid);
    const quote = db.prepare(`INSERT INTO quotes(job_id,provider_id,amount,message,status) VALUES(?,?,13900,?,'accepted')`)
      .run(jobId, providerId, 'Fixture-Angebot');
    db.prepare('UPDATE jobs SET accepted_quote_id=? WHERE id=?').run(Number(quote.lastInsertRowid), jobId);
    db.prepare(`INSERT INTO job_dispatches(job_id,provider_id,status,match_score,distance_km) VALUES(?,?, 'accepted', 92, 3.2)`)
      .run(jobId, providerId);
    db.prepare(`INSERT INTO job_assignments(job_id,provider_id,contact_user_id,assigned_by_user_id) VALUES(?,?,?,?)`)
      .run(jobId, providerId, contactId, providerId);
    const appointment = db.prepare(`INSERT INTO appointments(job_id,provider_id,homeowner_id,contact_user_id,start_at,status)
      VALUES(?,?,?,? ,datetime('now','+2 day'),'confirmed')`).run(jobId, providerId, homeownerId, contactId);
    db.prepare(`INSERT INTO reviews(job_id,homeowner_id,provider_id,rating,comment,verified,eligibility_reason) VALUES(?,?,?,?,?,1,'fixture')`)
      .run(jobId, homeownerId, providerId, 5, 'Fixture-Bewertung');
    db.prepare(`INSERT INTO notifications(user_id,kind,title,body,href,read_at,channel,priority,status) VALUES(?,?,?,?,?,NULL,'in_app',5,'sent')`)
      .run(homeownerId, 'fixture', 'Fixture Benachrichtigung', 'Deterministische Testnachricht', `/app/jobs/${jobId}`);
    return { homeownerId, providerId, contactId, propertyId, assetId, jobId, appointmentId: Number(appointment.lastInsertRowid) };
  })();
}
