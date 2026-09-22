import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const slug = formData.get('slug') as string;
    const imageType = (formData.get('imageType') as string) || 'main'; // 'main' or 'article'
    const imageIndex = formData.get('imageIndex') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'No slug provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Supported: JPEG, PNG, WebP, GIF' },
        { status: 400 }
      );
    }

    // Create directory
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'posts', slug);
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate filename
    const ext = file.name.split('.').pop() || 'jpeg';
    let filename: string;
    if (imageType === 'main') {
      filename = `main.${ext}`;
    } else {
      filename = `image-${imageIndex || Date.now()}.${ext}`;
    }

    // Write file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    // Return public URL
    const publicUrl = `/images/posts/${slug}/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
