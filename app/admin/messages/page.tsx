import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

export default async function AdminMessages() {
  await getServerSession(authOptions);
  const messages = await prisma.message.findMany({ include: { targets: true }, orderBy: { createdAt: 'desc' } });
  return (
    <div>
      <h1>Messages</h1>
      {messages.map((msg) => (
        <div key={msg.id} className="card">
          <h3>{msg.title}</h3>
          <p>{msg.content}</p>
          <p>Targets: {msg.targets.map((t) => t.unitId ?? t.role).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
