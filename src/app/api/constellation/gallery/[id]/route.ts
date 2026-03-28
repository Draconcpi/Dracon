import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT - Update gallery item (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Record<string, unknown> = {};

    if (body.title !== undefined) updateData.title = body.title;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.accent !== undefined) updateData.accent = body.accent;
    if (body.order !== undefined) updateData.order = body.order;

    const item = await prisma.constellationGallery.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Gallery PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar item de galeria.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.constellationGallery.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Item de galeria deletado.' });
  } catch (error) {
    console.error('Gallery DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar item de galeria.' },
      { status: 500 }
    );
  }
}
