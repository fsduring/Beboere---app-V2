import { NextResponse } from 'next/server';
import { registerUser } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, name, houseCode } = body;
  try {
    const user = await registerUser(email, password, name, houseCode);
    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
