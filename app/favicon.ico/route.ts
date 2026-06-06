/**
 * 浏览器兼容图标路由：避免默认请求 /favicon.ico 时出现 404。
 */
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="10" fill="#050505"/>
  <path d="M12 38 28 16h24L36 38h16L36 56H12l16-18H12Z" fill="#76B900"/>
</svg>`;

export function GET() {
  return new Response(icon, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=86400',
    },
  });
}
