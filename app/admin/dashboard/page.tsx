import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <h1>Admin dashboard</h1>
      <div className="card">
        <p>Velkommen, {session?.user.email}</p>
        <div className="flex">
          <Link href="/admin/units">Units</Link>
          <Link href="/admin/messages">Messages</Link>
          <Link href="/admin/documents">Documents</Link>
          <Link href="/admin/photos">Photos</Link>
        </div>
      </div>
    </div>
  );
}
