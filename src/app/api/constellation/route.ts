import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Return all constellation data (public)
export async function GET() {
  try {
    const [characters, lines, lore, gallery] = await Promise.all([
      prisma.constellationCharacter.findMany({
        where: { active: true },
        orderBy: { order: 'asc' },
      }),
      prisma.constellationLine.findMany({
        include: { from: true, to: true },
      }),
      prisma.constellationLore.findMany({
        orderBy: { order: 'asc' },
      }),
      prisma.constellationGallery.findMany({
        orderBy: { order: 'asc' },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { characters, lines, lore, gallery },
    });
  } catch (error) {
    console.error('Constellation GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar dados da constelação.' },
      { status: 500 }
    );
  }
}
