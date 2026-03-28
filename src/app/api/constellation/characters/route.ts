import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - List all characters (admin: all, public: active only)
export async function GET() {
  try {
    const characters = await prisma.constellationCharacter.findMany({
      orderBy: { order: 'asc' },
      include: {
        connectionsFrom: { include: { to: true } },
        connectionsTo: { include: { from: true } },
      },
    });
    return NextResponse.json({ success: true, data: characters });
  } catch (error) {
    console.error('Characters GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar personagens.' },
      { status: 500 }
    );
  }
}

// POST - Create character (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { charId, name, role, description, color, cx, cy, imageUrl, order, active } = body;

    if (!charId || !name || !role || !description) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: charId, name, role, description.' },
        { status: 400 }
      );
    }

    const character = await prisma.constellationCharacter.create({
      data: {
        charId,
        name,
        role,
        description,
        color: color || '#a855f4',
        cx: cx ?? 400,
        cy: cy ?? 200,
        imageUrl: imageUrl || null,
        order: order ?? 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: character }, { status: 201 });
  } catch (error) {
    console.error('Characters POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar personagem.' },
      { status: 500 }
    );
  }
}
