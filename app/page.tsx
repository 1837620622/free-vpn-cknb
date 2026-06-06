import { SiteShell } from '@/components/ui/SiteShell';
import { VpnCard } from '@/components/ui/VpnCard';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { IconRocket, IconLayers, IconServer, IconBolt, IconSparkle } from '@/components/ui/Icon';
import { getEntries, getMeta } from '@/lib/read-data';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const meta = getMeta();
  const all = getEntries();
  const realtime = all.filter((e) => {
    if (!e.publishedAt) return false;
    const diff = Date.now() - new Date(e.publishedAt).getTime();
    return diff < 24 * 3600 * 1000;
  });
  const trial = all.filter((e) => e.type === 'trial');
  const free = all.filter((e) => e.type === 'free');
  const node = all.filter((e) => e.type === 'node');
  const review = all.filter((e) => e.type === 'review');

  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '未更新';

  return (
    <SiteShell totalActive={all.length} totalSources={meta.sources?.length ?? 0} updatedAt={updatedAt}>
      {/* Hero */}
      <section className="relative mb-10">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <IconSparkle width={13} height={13} />
          <span>GitHub Actions 每 6 小时自动抓取 · 15 天滚动窗口</span>
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
          实时聚合 <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">免费 VPN</span> 情报
        </h1>
        <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          自动同步 13 个公开源，按试用 / 免费 / 实时节点 / 机场评测 分类展示。
          每条信息含官方注册入口、优惠码、流量、协议、地域与最近更新。
        </p>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="活跃条目" value={all.length} Icon={IconLayers} tone="from-blue-500 to-cyan-500" />
          <Stat label="实时" value={realtime.length} Icon={IconBolt} tone="from-emerald-500 to-teal-500" />
          <Stat label="试用机场" value={trial.length} Icon={IconRocket} tone="from-violet-500 to-pink-500" />
          <Stat label="实时节点" value={node.length} Icon={IconServer} tone="from-amber-500 to-orange-500" />
        </div>
      </section>

      {/* Realtime section */}
      {realtime.length > 0 && (
        <section className="mb-10">
          <SectionTitle title="实时" subtitle="24 小时内更新" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {realtime.slice(0, 12).map((e) => <VpnCard key={e.id} entry={e} />)}
          </div>
        </section>
      )}

      <section className="mb-10">
        <SectionTitle title="试用机场" subtitle="注册即用 / 含优惠码" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trial.slice(0, 12).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title="免费机场" subtitle="有免费套餐或永久免费" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {free.slice(0, 12).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title="实时节点" subtitle="抓取自公开订阅链接" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {node.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </section>

      <section className="mb-10">
        <SectionTitle title="评测推荐" subtitle="精选权威机场评测" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {review.slice(0, 9).map((e) => <VpnCard key={e.id} entry={e} />)}
        </div>
      </section>
    </SiteShell>
  );
}

function Stat({ label, value, Icon, tone }: { label: string; value: number; Icon: any; tone: string }) {
  return (
    <div className="rounded-2xl bg-white/72 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-white/40 p-4">
      <div className="flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400">
        <span className={`h-7 w-7 rounded-lg bg-gradient-to-br ${tone} text-white flex items-center justify-center`}>
          <Icon width={14} height={14} />
        </span>
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4 flex items-end justify-between">
      <div>
        <h2 className="text-[22px] font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
