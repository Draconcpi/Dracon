import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { CONTENT_TAG, TEXT_PREFIX, readContentOverrides } from '@/lib/content';
import { DEFAULT_TEXTS, isEditableKey, type ContentLocale } from '@/i18n/editable';

export const dynamic = 'force-dynamic';

const LOCALES: ContentLocale[] = ['pt', 'en'];
const MAX_LENGTH = 5000;

// GET - Text overrides edited in the admin (public)
export async function GET() {
  try {
    return NextResponse.json({ success: true, data: await readContentOverrides() });
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao buscar textos.' }, { status: 500 });
  }
}

// PUT - Save text overrides (admin only). Body: { pt?: { key: text | null }, en?: { ... } }
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = (await request.json()) as Partial<Record<ContentLocale, Record<string, unknown>>>;
    const operations: Prisma.PrismaPromise<unknown>[] = [];

    for (const locale of LOCALES) {
      const entries = body?.[locale];
      if (!entries || typeof entries !== 'object') continue;

      for (const [key, value] of Object.entries(entries)) {
        if (!isEditableKey(locale, key)) {
          return NextResponse.json({ success: false, error: `Texto desconhecido: ${key}` }, { status: 400 });
        }
        const settingKey = `${TEXT_PREFIX}${locale}.${key}`;

        if (value === null || value === DEFAULT_TEXTS[locale][key]) {
          operations.push(prisma.settings.deleteMany({ where: { key: settingKey } }));
        } else if (typeof value === 'string' && value.length <= MAX_LENGTH) {
          operations.push(
            prisma.settings.upsert({
              where: { key: settingKey },
              update: { value },
              create: { key: settingKey, value },
            })
          );
        } else {
          return NextResponse.json({ success: false, error: `Texto inválido: ${key}` }, { status: 400 });
        }
      }
    }

    await prisma.$transaction(operations);
    revalidateTag(CONTENT_TAG);
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, data: { updated: operations.length } });
  } catch (error) {
    console.error('Content PUT error:', error);
    return NextResponse.json({ success: false, error: 'Erro ao salvar textos.' }, { status: 500 });
  }
}
