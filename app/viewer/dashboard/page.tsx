import { prisma } from '../../../lib/prisma';

export default async function ViewerDashboard() {
  const messages = await prisma.message.findMany({ include: { targets: true }, orderBy: { createdAt: 'desc' }, take: 5 });
  return (
    <div>
      <h1>Viewer overview</h1>
      <div className="card">
        <h3>Recent messages</h3>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>{m.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
