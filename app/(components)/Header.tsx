'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { getDictionary } from '../../lib/i18n';

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const dict = getDictionary(session?.user.language ?? 'da');
  const role = session?.user.role;

  const links = [
    role === 'ADMIN' && { href: '/admin/dashboard', label: dict.adminDashboard },
    role === 'VIEWER' && { href: '/viewer/dashboard', label: dict.viewerDashboard },
    role === 'BEBOER' && { href: '/beboer/dashboard', label: dict.beboerDashboard },
    role === 'BEBOER' && { href: '/settings', label: 'Settings' }
  ].filter(Boolean) as { href: string; label: string }[];

  return (
    <header style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', borderBottom: '1px solid #d0d7de' }}>
      <nav>
        {links.map((link) => (
          <Link key={link.href} href={link.href} style={{ marginRight: 12, fontWeight: pathname.startsWith(link.href) ? 700 : 500 }}>
            {link.label}
          </Link>
        ))}
      </nav>
      <div>
        {session?.user ? (
          <button onClick={() => signOut({ callbackUrl: '/login' })}>{dict.logout}</button>
        ) : (
          <Link href="/login">{dict.login}</Link>
        )}
      </div>
    </header>
  );
}
