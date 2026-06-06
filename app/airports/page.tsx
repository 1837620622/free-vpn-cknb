import { ListPage } from '@/components/ui/ListPage';
export default function Page() {
  return <ListPage title="机场库" subtitle="试用 + 免费 + 实时 + 评测，所有活跃机场集中展示。" filter={['trial', 'free', 'index', 'review']} />;
}
