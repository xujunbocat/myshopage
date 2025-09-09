import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response('Not Found', { status: 404 });
  }
  const directusUrl = `https://panda-dance.directus.app/assets/${id}`;
  const res = await fetch(directusUrl);
  if (!res.ok) {
    return new Response('Not Found', { status: 404 });
  }
  return new Response(await res.arrayBuffer(), {
    status: 200,
    headers: {
      'Content-Type': res.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, s-maxage=31536000, immutable',
    },
  });
}; 