import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';

export default async function ViewerUnit({ params }: { params: { unitId: string } }) {
  const unit = await prisma.unit.findUnique({ where: { id: params.unitId }, include: { tenants: true } });
  if (!unit) return notFound();
  const documents = await prisma.document.findMany({ where: { unitId: unit.id }, include: { versions: true } });
  return (
    <div>
      <h1>{unit.name}</h1>
      <p>House code: {unit.houseCode}</p>
      <h3>Documents</h3>
      <ul>
        {documents.map((d) => (
          <li key={d.id}>{d.title} ({d.status})</li>
        ))}
      </ul>
    </div>
  );
}
