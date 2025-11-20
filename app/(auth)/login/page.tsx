'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h1>Login</h1>
      <form onSubmit={submit} className="card">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 12 }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p><Link href="/">Til forsiden</Link></p>
    </div>
  );
}
