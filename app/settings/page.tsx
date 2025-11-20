'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SettingsPage() {
  const { data } = useSession();
  const [language, setLanguage] = useState(data?.user.language ?? 'da');
  const [seniorMode, setSeniorMode] = useState(data?.user.seniorMode ?? false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const save = async () => {
    const res = await fetch('/api/auth/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language, seniorMode, currentPassword, newPassword })
    });
    const dataRes = await res.json();
    setMessage(res.ok ? 'Saved' : dataRes.error);
  };

  return (
    <div>
      <h1>Settings</h1>
      <div className="card">
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="da">Dansk</option>
          <option value="en">English</option>
        </select>
        <div>
          <label>
            <input type="checkbox" checked={seniorMode} onChange={(e) => setSeniorMode(e.target.checked)} /> Senior mode
          </label>
        </div>
        <h4>Change password</h4>
        <input placeholder="Current password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        <input placeholder="New password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <button onClick={save}>Save</button>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}
