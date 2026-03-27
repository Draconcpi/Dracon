import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

// POST - Upload image (admin only)
// In production, this would use Cloudinary or S3. 
// For now, it accepts base64 or provides upload URL guidance.
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Nenhum arquivo enviado.' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de arquivo não permitido. Use JPEG, PNG, WebP ou GIF.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'Arquivo muito grande. Máximo: 10MB.' },
        { status: 400 }
      );
    }

    // In production, upload to Cloudinary:
    // const cloudinaryUrl = await uploadToCloudinary(file);

    // For development, return a placeholder URL
    const timestamp = Date.now();
    const imageUrl = `/uploads/${timestamp}-${file.name}`;

    return NextResponse.json({
      success: true,
      data: {
        url: imageUrl,
        filename: file.name,
        size: file.size,
        type: file.type,
      },
      message: 'Upload realizado com sucesso. Configure Cloudinary para produção.',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer upload.' },
      { status: 500 }
    );
  }
}
