import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { slugify } from '@/lib/utils';

// GET - List all portfolio items (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;

    const [items, total] = await Promise.all([
      prisma.portfolioItem.findMany({
        where,
        include: { category: true },
        orderBy: { order: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.portfolioItem.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar portfólio.' },
      { status: 500 }
    );
  }
}

// POST - Create portfolio item (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, imageUrl, thumbnailUrl, categoryId, tags, featured, order } = body;

    if (!title || !description || !imageUrl || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Campos obrigatórios: title, description, imageUrl, categoryId.' },
        { status: 400 }
      );
    }

    const item = await prisma.portfolioItem.create({
      data: {
        title,
        slug: slugify(title),
        description,
        imageUrl,
        thumbnailUrl: thumbnailUrl || null,
        categoryId,
        tags: tags || [],
        featured: featured || false,
        order: order || 0,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar item.' },
      { status: 500 }
    );
  }
}
