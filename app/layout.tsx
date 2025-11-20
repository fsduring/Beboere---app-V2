import './globals.css';
import { ReactNode } from 'react';
import { Header } from './(components)/Header';
import { getServerSession } from 'next-auth';
import { authOptions } from '../lib/auth';
import { SessionProvider } from './providers';

export const metadata = {
  title: 'Beboere App',
  description: 'Full-stack Next.js MVP'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang={session?.user.language ?? 'da'}>
      <body className={session?.user.seniorMode ? 'senior' : ''}>
        <SessionProvider session={session}>
          <Header />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
