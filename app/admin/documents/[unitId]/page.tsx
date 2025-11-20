import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';

export default async function UnitDocuments({ params }: { params: { unitId: string } }) {
  const unit = await prisma.unit.findUnique({ where: { id: params.unitId } });
  if (!unit) return notFound();
  const documents = await prisma.document.findMany({ where: { unitId: unit.id }, include: { versions: true } });
  return (
    <div>
      <h1>Documents for {unit.name}</h1>
      {documents.map((doc) => (
        <div key={doc.id} className="card">
          <h3>{doc.title}</h3>
          <p>Status: {doc.status}</p>
          <ul>
            {doc.versions.map((v) => (
              <li key={v.id}>Version {v.version} - {v.fileKey}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
