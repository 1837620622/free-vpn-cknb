import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '实时节点', title: '订阅节点', subtitle: '自动从公开订阅链接抓取的最新节点。', filter: 'node' });
}
