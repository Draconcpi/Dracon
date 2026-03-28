import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// DELETE - Delete constellation line (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    await prisma.constellationLine.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: 'Conexão deletada.' });
  } catch (error) {
    console.error('Line DELETE error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar conexão.' },
      { status: 500 }
    );
  }
}
