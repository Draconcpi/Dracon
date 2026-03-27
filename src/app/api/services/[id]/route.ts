import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// PUT - Update service (admin only)
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

    if (body.title) { updateData.title = body.title; updateData.slug = slugify(body.title); }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.shortDescription !== undefined) updateData.shortDescription = body.shortDescription;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.priceNote !== undefined) updateData.priceNote = body.priceNote;
    if (body.features !== undefined) updateData.features = body.features;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.active !== undefined) updateData.active = body.active;

    const service = await prisma.service.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error('Service PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar serviço.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete service (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.service.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Serviço deletado.' });
  } catch (error) {
    console.error('Service DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar serviço.' },
      { status: 500 }
    );
  }
}
