import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET - List all gallery items
export async function GET() {
  try {
    const gallery = await prisma.constellationGallery.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ success: true, data: gallery });
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar galeria.' },
      { status: 500 }
    );
  }
}

// POST - Create gallery item (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, imageUrl, accent, order } = body;

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Campo obrigatório: title.' },
        { status: 400 }
      );
    }

    const item = await prisma.constellationGallery.create({
      data: {
        title,
        imageUrl: imageUrl || null,
        accent: accent || '#a855f4',
        order: order ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar item de galeria.' },
      { status: 500 }
    );
  }
}
