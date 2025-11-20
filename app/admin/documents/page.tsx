import Link from 'next/link';
import { prisma } from '../../../lib/prisma';

export default async function AdminDocumentsIndex() {
  const units = await prisma.unit.findMany();
  return (
    <div>
      <h1>Documents</h1>
      <ul>
        {units.map((u) => (
          <li key={u.id}>
            <Link href={`/admin/documents/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
