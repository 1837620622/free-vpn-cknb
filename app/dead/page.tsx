import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '跑路名单', title: '跑路与历史', subtitle: '已确认跑路或长期不可用的机场，仅作历史参考。', filter: 'dead' });
}
