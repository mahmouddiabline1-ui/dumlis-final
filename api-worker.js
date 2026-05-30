export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = 'https://dumlis-final-production.up.railway.app' + url.pathname + url.search;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
          'Access-Control-Allow-Headers': 'Authorization,Content-Type,Accept',
        },
      });
    }

    const headers = new Headers();
    for (const [k, v] of request.headers.entries()) {
      if (k.toLowerCase() !== 'host') headers.set(k, v);
    }

    const init = { method: request.method, headers };
    if (!['GET', 'HEAD'].includes(request.method)) {
      init.body = request.body;
      init.duplex = 'half';
    }

    const resp = await fetch(targetUrl, init);
    const respHeaders = new Headers(resp.headers);
    respHeaders.set('Access-Control-Allow-Origin', '*');

    return new Response(resp.body, { status: resp.status, headers: respHeaders });
  },
};
