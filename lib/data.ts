/**
 * 数据读写：data/vpns.json / data/archive.json / data/meta.json
 */
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import type { DataFile, Meta, SourceMeta, VpnEntry, VpnType } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MAIN_FILE = path.join(DATA_DIR, 'vpns.json');
const ARCHIVE_FILE = path.join(DATA_DIR, 'archive.json');

export async function ensureDataDir(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function loadData(): Promise<DataFile> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(MAIN_FILE, 'utf-8');
    const data = JSON.parse(raw) as DataFile;
    return data;
  } catch {
    return {
      entries: [],
      meta: emptyMeta(),
    };
  }
}

export async function loadArchive(): Promise<VpnEntry[]> {
  try {
    const raw = await fs.readFile(ARCHIVE_FILE, 'utf-8');
    return JSON.parse(raw) as VpnEntry[];
  } catch {
    return [];
  }
}

export async function saveData(entries: VpnEntry[], meta: Meta): Promise<void> {
  await ensureDataDir();
  const main: DataFile = { entries, meta };
  await fs.writeFile(MAIN_FILE, JSON.stringify(main, null, 2), 'utf-8');
}

export async function saveArchive(entries: VpnEntry[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(ARCHIVE_FILE, JSON.stringify(entries, null, 2), 'utf-8');
}

export function emptyMeta(): Meta {
  const types: VpnType[] = ['trial', 'free', 'node', 'index', 'review', 'dead'];
  return {
    generatedAt: new Date().toISOString(),
    totalActive: 0,
    totalDead: 0,
    totalByType: Object.fromEntries(types.map((t) => [t, 0])) as Record<VpnType, number>,
    totalBySource: {},
    sources: [],
    cutoffDays: 15,
  };
}

export function buildMeta(
  entries: VpnEntry[],
  sourceMetas: SourceMeta[],
  cutoffDays: number
): Meta {
  const byType: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let active = 0;
  let dead = 0;
  for (const e of entries) {
    byType[e.type] = (byType[e.type] ?? 0) + 1;
    for (const s of e.sources) bySource[s] = (bySource[s] ?? 0) + 1;
    if (e.isActive) active++;
    else dead++;
  }
  return {
    generatedAt: new Date().toISOString(),
    totalActive: active,
    totalDead: dead,
    totalByType: byType as Record<VpnType, number>,
    totalBySource: bySource,
    sources: sourceMetas,
    cutoffDays,
  };
}

export async function getLatestData(): Promise<DataFile> {
  const data = await loadData();
  return data;
}
