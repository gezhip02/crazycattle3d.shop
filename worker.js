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
      let key = url.pathname.replace('/download/', '');
      
      // 检查 bucket 是否正确绑定
      if (!env.CRAZYCATTLE3D_BUCKET) {
        return new Response('R2 bucket not found in environment', { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 列出所有文件
      const listed = await env.CRAZYCATTLE3D_BUCKET.list();
      const files = listed.objects.map(obj => obj.key);
      
      // 返回文件列表（用于调试）
      if (url.pathname === '/list') {
        return new Response(JSON.stringify({
          files: files,
          requestedFile: key,
          bucketExists: !!env.CRAZYCATTLE3D_BUCKET
        }, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }

      // 添加 downloads/ 前缀如果没有的话
      if (!key.startsWith('downloads/')) {
        key = 'downloads/' + key;
      }

      // 检查请求的文件是否存在
      if (!files.includes(key)) {
        return new Response(JSON.stringify({
          error: 'File not found',
          requestedFile: key,
          availableFiles: files
        }, null, 2), { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 获取文件
      const object = await env.CRAZYCATTLE3D_BUCKET.get(key);

      if (!object) {
        return new Response(JSON.stringify({
          error: 'File not found in bucket',
          requestedFile: key,
          availableFiles: files
        }, null, 2), { 
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        });
      }

      // 设置响应头
      const headers = new Headers();
      headers.set('Content-Type', object.httpMetadata?.contentType || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${key.replace('downloads/', '')}"`);
      headers.set('Access-Control-Allow-Origin', '*');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new Response(object.body, {
        headers,
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message,
        stack: error.stack
      }, null, 2), { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
} 