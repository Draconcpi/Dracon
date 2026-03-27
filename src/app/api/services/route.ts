import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET - List all services (public)
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json({ success: true, data: services });
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar serviços.' },
      { status: 500 }
    );
  }
}

// POST - Create service (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, shortDescription, price, priceNote, features, icon, order, active } = body;

    if (!title || !description || !shortDescription) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: title, description, shortDescription.' },
        { status: 400 }
      );
    }

    const service = await prisma.service.create({
      data: {
        title,
        slug: slugify(title),
        description,
        shortDescription,
        price: price || null,
        priceNote: priceNote || null,
        features: features || [],
        icon: icon || '⭐',
        order: order || 0,
        active: active ?? true,
      },
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error) {
    console.error('Services POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar serviço.' },
      { status: 500 }
    );
  }
}
