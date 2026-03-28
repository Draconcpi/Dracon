import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - List all lore sections
export async function GET() {
  try {
    if (!prisma.constellationLore) {
      return NextResponse.json({ success: true, data: [] });
    }
    const lore = await prisma.constellationLore.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: lore });
  } catch (error) {
    console.error('Lore GET error:', error);
    return NextResponse.json({ success: true, data: [] });
  }
}

// POST - Create lore section (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, text, chapter, order } = body;

    if (!title || !text) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: title, text.' },
        { status: 400 }
      );
    }

    const lore = await prisma.constellationLore.create({
      data: {
        title,
        text,
        chapter: chapter ?? 0,
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: lore }, { status: 201 });
  } catch (error) {
    console.error('Lore POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar seção de lore.' },
      { status: 500 }
    );
  }
}
