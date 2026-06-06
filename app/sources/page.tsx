import { SiteShell } from '@/components/ui/SiteShell';
import { getMeta, getEntries } from '@/lib/read-data';

export const dynamic = 'force-dynamic';

const SOURCE_DESCR: Record<string, string> = {
  ygjc: '一个机场 ygjc.cc - 月度 + 试用 + 优惠码',
  kerrynotes: 'Kerry 的学习笔记 - 试用码与免费套餐',
  waiyiyuyan: '我爱白嫖 - 免费节点与机场导航',
  au1rxx: 'Au1rxx 验证节点 - clash 订阅 + status 统计',
  tonykongcn: 'tonykongcn 验证节点 - 多协议节点',
  freenodes: 'FreeNodes 节点池',
  vpnpaihang: 'VPN 排行榜 - 日榜节点 + 推荐机场',
  vpnbaike: 'VPN 百科 - 镜像日榜',
  everett7623: '机场推荐索引 2026 - 全面评测',
  gfwoff: 'GFWOFF - VPN/机场评测文章',
  panda: 'Panda-VPN-Pro - 低价机场评测 (DiningFactory)',
  'airport-access': 'ChatGPT 机场精选 - markdown 表格',
  'tg-enricher': '访问注册页补全 Telegram 群/频道',
};

export default function SourcesPage() {
  const meta = getMeta();
  const all = getEntries();
  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '';
  const sources = meta.sources || [];
  const bySource = new Map<string, number>();
  for (const e of all) for (const s of e.sources || []) bySource.set(s, (bySource.get(s) || 0) + 1);

  return (
    <SiteShell totalActive={all.length} totalSources={sources.length} updatedAt={updatedAt}>
      <section className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">数据源</h1>
        <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-300">所有数据均由 GitHub Actions 自动抓取，6 小时一次</p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((s) => (
          <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="rounded-2xl bg-white/72 dark:bg-white/5 backdrop-blur-2xl ring-1 ring-white/40 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[15px] font-semibold">{s.displayName || s.id}</div>
                <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5">{SOURCE_DESCR[s.id] || '自动抓取源'}</div>
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate max-w-md">{s.url}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">{bySource.get(s.id) || 0}</div>
                <div className="text-[11px] text-slate-500">条</div>
                <div className={`mt-2 inline-block px-2 py-0.5 text-[10px] rounded-full ${s.lastSuccess ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300'}`}>
                  {s.lastSuccess ? '正常' : '失败'}
                </div>
              </div>
            </div>
            {s.errorMessage && <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400">{s.errorMessage}</div>}
          </a>
        ))}
      </div>
    </SiteShell>
  );
}
