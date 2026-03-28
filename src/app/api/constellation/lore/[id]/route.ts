import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT - Update lore section (admin only)
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
    if (body.text !== undefined) updateData.text = body.text;
    if (body.chapter !== undefined) updateData.chapter = body.chapter;
    if (body.order !== undefined) updateData.order = body.order;

    const lore = await prisma.constellationLore.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: lore });
  } catch (error) {
    console.error('Lore PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar lore.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lore section (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.constellationLore.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Lore deletada.' });
  } catch (error) {
    console.error('Lore DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar lore.' },
      { status: 500 }
    );
  }
}
