import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '试用机场', title: '注册即用', subtitle: '注册即得流量或含优惠码，免费试用期限从 1 天到 1 年。', filter: 'trial' });
}
