import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Helper: safely query a model that may not exist yet in the generated client
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

// GET - Return all constellation data (public)
export async function GET() {
  try {
    const [characters, lines, lore, gallery] = await Promise.all([
      safeQuery(
        () =>
          prisma.constellationCharacter.findMany({
            where: { active: true },
            orderBy: { order: 'asc' },
          }),
        []
      ),
      safeQuery(
        () =>
          prisma.constellationLine.findMany({
            include: { from: true, to: true },
          }),
        []
      ),
      safeQuery(
        () => prisma.constellationLore.findMany({ orderBy: { order: 'asc' } }),
        []
      ),
      safeQuery(
        () =>
          prisma.constellationGallery.findMany({ orderBy: { order: 'asc' } }),
        []
      ),
    ]);

    return NextResponse.json({
      success: true,
      data: { characters, lines, lore, gallery },
    });
  } catch (error) {
    console.error('Constellation GET error:', error);
    // Return empty data instead of 500 so the page still renders
    return NextResponse.json({
      success: true,
      data: { characters: [], lines: [], lore: [], gallery: [] },
    });
  }
}
