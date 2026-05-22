/**
 * Cloudflare Worker for DUMLIS API Proxy
 * Routes API requests to Railway backend and handles CORS
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // List of API paths to proxy to the backend
    const apiPaths = [
      '/auth/',
      '/students/',
      '/courses/',
      '/grades/',
      '/student-grades/',
      '/attendance/',
      '/financial/',
      '/schedules/',
      '/enrollments/',
      '/departments/',
      '/faculties/',
      '/docs',
      '/redoc',
      '/openapi.json',
      '/health',
      '/ready'
    ];

    // Check if this is an API request
    const isApiRequest = apiPaths.some(path => url.pathname.startsWith(path));

    if (isApiRequest) {
      // Proxy to Railway backend
      const backendUrl = new URL(url);
      backendUrl.host = 'dumlis-final.railway.app';
      backendUrl.protocol = 'https:';

      try {
        const response = await fetch(new Request(backendUrl, {
          method: request.method,
          headers: request.headers,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        }));

        // Clone response and add CORS headers
        const newResponse = new Response(response.body, response);
        const origin = request.headers.get('origin') || '*';

        newResponse.headers.set('Access-Control-Allow-Origin', origin);
        newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
        newResponse.headers.set('Access-Control-Max-Age', '3600');

        return newResponse;
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Backend service unavailable',
          message: (error as Error).message
        }), {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          }
        });
      }
    }

    // For all other requests (static assets, Pages), use the default handler
    return env.ASSETS.fetch(request);
  }
};

interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}
