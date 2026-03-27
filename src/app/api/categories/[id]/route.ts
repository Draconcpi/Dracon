import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// PUT - Update category (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const { name, description } = await request.json();
    const updateData: Record<string, unknown> = {};
    if (name) { updateData.name = name; updateData.slug = slugify(name); }
    if (description !== undefined) updateData.description = description;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Category PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar categoria.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Categoria deletada.' });
  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar categoria.' },
      { status: 500 }
    );
  }
}
