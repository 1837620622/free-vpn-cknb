import { ListPage } from '@/components/ui/ListPage';
export const dynamic = 'force-dynamic';
export default async function Page() {
  return await ListPage({ eyebrow: '机场库', title: '完整索引', subtitle: '试用 + 免费 + 实时 + 评测，所有活跃机场集中展示。', filter: ['trial', 'free', 'index', 'review'] });
}
