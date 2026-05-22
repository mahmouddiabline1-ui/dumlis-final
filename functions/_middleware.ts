/**
 * Cloudflare Pages Middleware for API Proxying and CORS
 */

export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // List of API paths to proxy
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
    '/rooms/',
    '/committees/',
    '/docs',
    '/redoc',
    '/openapi.json',
    '/health',
    '/ready',
  ];

  // Check if this is an API request
  const isApiRequest = apiPaths.some((path) => url.pathname.startsWith(path));

  if (isApiRequest) {
    // Build the backend URL
    const backendUrl = new URL(url);
    backendUrl.host = 'dumlis-final.railway.app';
    backendUrl.protocol = 'https:';

    try {
      // Proxy the request to the backend
      const response = await fetch(new Request(backendUrl, request));

      // Clone the response and add CORS headers
      const newResponse = new Response(response.body, response);
      const origin = request.headers.get('origin') || '*';

      newResponse.headers.set('Access-Control-Allow-Origin', origin);
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      newResponse.headers.set('Access-Control-Allow-Credentials', 'true');
      newResponse.headers.set('Access-Control-Max-Age', '3600');

      return newResponse;
    } catch (error) {
      // Return error response with CORS headers
      return new Response(
        JSON.stringify({
          error: 'Backend service unavailable',
          message: (error as Error).message,
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }
  }

  // For non-API requests, pass through to the next handler
  return context.next();
};
