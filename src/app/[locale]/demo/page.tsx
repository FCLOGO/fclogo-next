export const runtime = 'edge';
export const revalidate = 60; // 设置一个 revalidate

export default function TestPage() {
  return <h1>Hello World from Cloudflare Edge!</h1>;
}