import { NextResponse } from 'next/server';
import { createResetToken, resetPassword } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;
  try {
    const token = await createResetToken(email);
    return NextResponse.json({ token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { email, token, password } = body;
  try {
    await resetPassword(email, token, password);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
