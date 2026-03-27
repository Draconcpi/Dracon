import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// PUT - Mark message as read (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const { read } = await request.json();

    const message = await prisma.message.update({
      where: { id: params.id },
      data: { read: read ?? true },
    });

    return NextResponse.json({ success: true, data: message });
  } catch (error) {
    console.error('Message PUT error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar mensagem.' },
      { status: 500 }
    );
  }
}

// DELETE - Delete message (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.message.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Mensagem deletada.' });
  } catch (error) {
    console.error('Message DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar mensagem.' },
      { status: 500 }
    );
  }
}
