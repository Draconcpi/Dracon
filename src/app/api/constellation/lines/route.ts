import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - List all constellation lines
export async function GET() {
  try {
    if (!prisma.constellationLine) {
      return NextResponse.json({ success: true, data: [] });
    }
    const lines = await prisma.constellationLine.findMany({
      include: { from: true, to: true },
    });
    return NextResponse.json({ success: true, data: lines });
  } catch (error) {
    console.error('Lines GET error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - Create line (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { fromId, toId } = body;

    if (!fromId || !toId) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: fromId, toId.' },
        { status: 400 }
      );
    }

    if (fromId === toId) {
      return NextResponse.json(
        { success: false, error: 'Não é possível conectar um personagem a ele mesmo.' },
        { status: 400 }
      );
    }

    const line = await prisma.constellationLine.create({
      data: { fromId, toId },
      include: { from: true, to: true },
    });

    return NextResponse.json({ success: true, data: line }, { status: 201 });
  } catch (error) {
    console.error('Lines POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar conexão (pode já existir).' },
      { status: 500 }
    );
  }
}
