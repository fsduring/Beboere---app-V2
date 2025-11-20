import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Beboere app MVP</h1>
      <p>Vælg din portal:</p>
      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/admin/dashboard">Admin</Link></li>
        <li><Link href="/viewer/dashboard">Viewer</Link></li>
        <li><Link href="/beboer/dashboard">Beboer</Link></li>
      </ul>
    </div>
  );
}
