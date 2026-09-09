import { redirect } from 'next/navigation';

// /pro/jobs is the job-DETAIL namespace; the list lives at /pro/orders.
export default function ProJobsIndex() {
  redirect('/pro/orders');
}
