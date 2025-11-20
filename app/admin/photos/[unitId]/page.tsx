import { prisma } from '../../../../lib/prisma';
import { notFound } from 'next/navigation';

export default async function UnitPhotos({ params }: { params: { unitId: string } }) {
  const unit = await prisma.unit.findUnique({ where: { id: params.unitId } });
  if (!unit) return notFound();
  const photos = await prisma.photo.findMany({ where: { unitId: unit.id } });
  return (
    <div>
      <h1>Photos for {unit.name}</h1>
      {photos.map((photo) => (
        <div key={photo.id} className="card">
          <h3>{photo.title}</h3>
          <p>File: {photo.fileKey}</p>
          <p>{photo.pinned ? 'Pinned' : 'Unpinned'}</p>
        </div>
      ))}
    </div>
  );
}
