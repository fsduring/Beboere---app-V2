import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export default async function BeboerMessages() {
  const session = await getServerSession(authOptions);
  const units = await prisma.tenantUnit.findMany({ where: { userId: session?.user.id } });
  const unitIds = units.map((u) => u.unitId);
  const messages = await prisma.message.findMany({
    where: { targets: { some: { OR: [{ unitId: { in: unitIds } }, { role: 'BEBOER' }] } } },
    orderBy: { createdAt: 'desc' }
  });
  return (
    <div>
      <h1>Mine beskeder</h1>
      {messages.map((m) => (
        <div key={m.id} className="card">
          <h3>{m.title}</h3>
          <p>{m.content}</p>
        </div>
      ))}
    </div>
  );
}
