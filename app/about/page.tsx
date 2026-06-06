import { SiteShell } from '@/components/ui/SiteShell';
import { getMeta, getEntries } from '@/lib/read-data';

export const dynamic = 'force-dynamic';

export default function AboutPage() {
  const meta = getMeta();
  const all = getEntries();
  const updatedAt = meta.generatedAt ? new Date(meta.generatedAt).toLocaleString('zh-CN', { hour12: false }) : '';

  return (
    <SiteShell totalActive={all.length} totalSources={meta.sources?.length ?? 0} updatedAt={updatedAt}>
      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">关于本站</h1>
        <p className="mt-3 text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>CK 免费 VPN 搜集</strong> 是一个开源的免费 VPN / 机场情报聚合站。
          全部数据由 GitHub Actions 每 6 小时从 13 个公开源抓取，自动去重、归档、推送到 data/vpns.json，
          Vercel 监听到 git push 后自动重新部署。
        </p>

        <h2 className="mt-8 text-[20px] font-semibold tracking-tight">数据策略</h2>
        <ul className="mt-3 text-[14px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-5">
          <li>15 天滚动窗口：超期进 <code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">archive.json</code></li>
          <li>唯一键：<code className="px-1 bg-slate-100 dark:bg-slate-800 rounded">SHA1(normalize(name) + normalize(signupUrl))</code></li>
          <li>5 级新鲜度：实时 / 今日 / 本周 / 近期 / 隐藏</li>
        </ul>

        <h2 className="mt-8 text-[20px] font-semibold tracking-tight">作者</h2>
        <ul className="mt-3 text-[14px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-5">
          <li>传康Kk</li>
          <li>微信：1837620622</li>
          <li>邮箱：2040168455@qq.com</li>
          <li>B站 / 咸鱼：万能程序员</li>
        </ul>

        <h2 className="mt-8 text-[20px] font-semibold tracking-tight">声明</h2>
        <p className="mt-3 text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
          本项目仅供技术研究与学习用途，请遵守当地法律法规。
          数据来源于公开网络，仅作为索引展示，不对其中机场的可用性、安全性、合规性负责。
          使用任何免费服务前请自行评估风险。
        </p>
      </section>
    </SiteShell>
  );
}
