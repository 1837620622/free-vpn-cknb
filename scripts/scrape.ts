/**
 * 本地抓取入口：运行抓取流水线并写入 data/vpns.json。
 * 用法：
 *   pnpm scrape
 *   pnpm scrape:single --source ygjc
 */
import { loadArchive, saveArchive, saveData } from '../lib/data';
import { runScrapeJob } from '../lib/run-scrape';

async function main() {
  const sourceId = process.argv.find((a, i) => process.argv[i - 1] === '--source');
  const previousArchive = await loadArchive();
  const result = await runScrapeJob({
    sourceId,
    previousArchive,
    logger: { log: (msg) => console.log(msg) },
  });

  await saveArchive(result.archive);
  await saveData(result.data.entries, result.data.meta);
  console.log(`已写入 data/vpns.json：活跃 ${result.data.meta.totalActive} / 归档 ${result.archive.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
