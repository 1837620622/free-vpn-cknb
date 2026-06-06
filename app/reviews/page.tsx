import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '评测', title: '权威评测', subtitle: '来自公开榜单、机场精选和横评内容的综合评测。', filter: 'review' });
}
