export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.replace('/download/', '');

    if (!key) {
      return new Response('File not found', { status: 404 });
    }

    try {
      const object = await env.CRAZYCATTLE3D_BUCKET.get(key);

      if (!object) {
        return new Response('File not found', { status: 404 });
      }

      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata.contentType);
      headers.set('Content-Disposition', `attachment; filename="${key}"`);

      return new Response(object.body, {
        headers,
      });
    } catch (error) {
      return new Response('Error fetching file', { status: 500 });
    }
  },
} 