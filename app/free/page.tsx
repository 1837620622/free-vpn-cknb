import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '免费机场', title: '永久免费', subtitle: '官方长期免费套餐或公益免费节点。', filter: 'free' });
}
