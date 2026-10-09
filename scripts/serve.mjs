import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve(process.argv[2] || '.');
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
createServer(async (req,res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const name = pathname.endsWith('/') ? pathname+'index.html' : pathname;
    const file = resolve(root, '.'+name);
    if (!file.startsWith(root+'/')) throw Error('Invalid path');
    const bytes = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)] || 'application/octet-stream'});
    res.end(bytes);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(Number(process.env.PORT||5173), '127.0.0.1', ()=>console.log('Lentis preview: http://localhost:5173'));
