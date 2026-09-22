import { NextResponse } from 'next/server';

// Static placeholder - upload only works in local development
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(
    { error: 'File upload is only available in local development mode' },
    { status: 404 }
  );
}
