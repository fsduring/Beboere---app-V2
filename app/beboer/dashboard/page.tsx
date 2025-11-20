import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export default async function BeboerDashboard() {
  const session = await getServerSession(authOptions);
  const units = await prisma.unit.findMany({ where: { tenants: { some: { userId: session?.user.id } } } });
  const messages = await prisma.message.findMany({
    where: { targets: { some: { OR: [{ unitId: { in: units.map((u) => u.id) } }, { role: 'BEBOER' }] } } },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  return (
    <div>
      <h1>Beboer dashboard</h1>
      <div className="card">
        <h3>Dine lejemål</h3>
        <ul>
          {units.map((u) => (
            <li key={u.id}>{u.name}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Nyeste beskeder</h3>
        <ul>
          {messages.map((m) => (
            <li key={m.id}>{m.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
