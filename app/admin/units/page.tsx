import { authOptions } from '../../../lib/auth';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../lib/prisma';

export default async function AdminUnits() {
  await getServerSession(authOptions);
  const units = await prisma.unit.findMany({ include: { tenants: true } });
  return (
    <div>
      <h1>Units</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>House code</th>
            <th>Tenants</th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => (
            <tr key={unit.id}>
              <td>{unit.name}</td>
              <td>{unit.houseCode}</td>
              <td>{unit.tenants.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
