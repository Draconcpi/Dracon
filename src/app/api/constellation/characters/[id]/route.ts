import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT - Update character (admin only)
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

    if (body.charId !== undefined) updateData.charId = body.charId;
    if (body.name !== undefined) updateData.name = body.name;
    if (body.role !== undefined) updateData.role = body.role;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.color !== undefined) updateData.color = body.color;
    if (body.cx !== undefined) updateData.cx = body.cx;
    if (body.cy !== undefined) updateData.cy = body.cy;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.active !== undefined) updateData.active = body.active;

    const character = await prisma.constellationCharacter.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: character });
  } catch (error) {
    console.error('Character PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar personagem.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete character (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.constellationCharacter.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Personagem deletado.' });
  } catch (error) {
    console.error('Character DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar personagem.' },
      { status: 500 }
    );
  }
}
