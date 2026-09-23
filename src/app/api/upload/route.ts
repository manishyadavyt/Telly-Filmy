import { NextResponse } from 'next/server';

// Image uploads are handled client-side via imgbb (https://api.imgbb.com/)
// Set NEXT_PUBLIC_IMGBB_API_KEY in your .env.local to enable file uploads in the admin panel.
// This route is kept as a placeholder for static export compatibility.
export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json(
    {
      message: 'Image uploads use imgbb client-side API. Set NEXT_PUBLIC_IMGBB_API_KEY in .env.local.',
      docs: 'https://api.imgbb.com/',
    },
    { status: 200 }
  );
}
