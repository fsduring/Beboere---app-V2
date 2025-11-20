import { prisma } from '../../../lib/prisma';
import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';

export default async function BeboerDocuments() {
  const session = await getServerSession(authOptions);
  const units = await prisma.tenantUnit.findMany({ where: { userId: session?.user.id } });
  const unitIds = units.map((u) => u.unitId);
  const documents = await prisma.document.findMany({ where: { unitId: { in: unitIds }, status: 'ACTIVE' } });
  return (
    <div>
      <h1>Mine dokumenter</h1>
      <ul>
        {documents.map((d) => (
          <li key={d.id}>{d.title}</li>
        ))}
      </ul>
    </div>
  );
}
