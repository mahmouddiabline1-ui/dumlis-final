/**
 * Cloudflare Pages Middleware - API Proxy
 */

export const onRequest = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Check if this is an API request (starts with /auth/, /students/, etc)
  if (url.pathname.startsWith('/auth/') ||
      url.pathname.startsWith('/students/') ||
      url.pathname.startsWith('/courses/') ||
      url.pathname.startsWith('/grades/') ||
      url.pathname.startsWith('/docs') ||
      url.pathname.startsWith('/health') ||
      url.pathname.startsWith('/ready')) {

    // Route to Railway backend
    const backendUrl = new URL(request.url);
    backendUrl.host = 'dumlis-final.railway.app';
    backendUrl.protocol = 'https:';

    try {
      const backendRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined
      });

      const response = await fetch(backendRequest);
      const newResponse = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });

      // Add CORS headers
      const origin = request.headers.get('origin') || '*';
      newResponse.headers.set('Access-Control-Allow-Origin', origin);
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      newResponse.headers.set('Access-Control-Allow-Credentials', 'true');

      return newResponse;
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: 'Backend unavailable', message: error.message }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // For other requests, continue to Pages
  return context.next();
};
