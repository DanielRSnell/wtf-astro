import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('Test API called');
    
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Headers:', headers);
    
    return new Response(JSON.stringify({ 
      message: 'API is working',
      headers: headers,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Test API error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Unknown error',
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};