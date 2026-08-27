// app/api/hello/route.js
// Example Next.js App Router API route. Visit: /api/hello

export async function GET(request) {
  return new Response(JSON.stringify({ message: 'Hello from Next.js API route' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
