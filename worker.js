export default {
  async fetch(request, env) {
    // 添加 CORS 预检请求处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        },
      });
    }

    try {
      const url = new URL(request.url);
      const key = url.pathname.replace('/download/', '');
      
      // 添加基本的路径验证
      if (!key || key === '/') {
        return new Response('File name is required', { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 检查 bucket 是否正确绑定
      if (!env.CRAZYCATTLE3D_BUCKET) {
        return new Response('Storage configuration error', { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 从 R2 获取文件
      const object = await env.CRAZYCATTLE3D_BUCKET.get(key);

      if (!object) {
        return new Response('File not found', { 
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 设置响应头
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${key}"`);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new Response(object.body, {
        headers,
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
} 