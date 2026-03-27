import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET - Single portfolio item (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.portfolioItem.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: { category: true },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Item não encontrado.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Portfolio GET by ID error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar item.' },
      { status: 500 }
    );
  }
}

// PUT - Update portfolio item (admin only)
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
    const { title, description, imageUrl, thumbnailUrl, categoryId, tags, featured, order } = body;

    const updateData: Record<string, unknown> = {};
    if (title) { updateData.title = title; updateData.slug = slugify(title); }
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (thumbnailUrl !== undefined) updateData.thumbnailUrl = thumbnailUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (tags !== undefined) updateData.tags = tags;
    if (featured !== undefined) updateData.featured = featured;
    if (order !== undefined) updateData.order = order;

    const item = await prisma.portfolioItem.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error('Portfolio PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar item.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete portfolio item (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.portfolioItem.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true, message: 'Item deletado.' });
  } catch (error) {
    console.error('Portfolio DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar item.' },
      { status: 500 }
    );
  }
}
