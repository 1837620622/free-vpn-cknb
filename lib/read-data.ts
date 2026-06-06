/**
 * 数据读取：优先读取线上快照，失败时回退到 data/vpns.json。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { VpnEntry, Meta, DataFile } from './types';

const DATA_PATH = join(process.cwd(), 'data', 'vpns.json');
const DATA_KEY = 'vpn:data';

export function loadAllData(): DataFile {
  try {
    const raw = readFileSync(DATA_PATH, 'utf-8');
    const data = JSON.parse(raw) as DataFile;
    return data;
  } catch {
    return {
      entries: [],
      meta: {
        generatedAt: new Date().toISOString(),
        totalActive: 0,
        totalDead: 0,
        totalByType: {} as any,
        totalBySource: {} as any,
        cutoffDays: 15,
        sources: [],
      },
    };
  }
}

async function loadEdgeData(): Promise<DataFile | null> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const context = await getCloudflareContext({ async: true });
    const kv = (context.env as { VPN_DATA?: KVNamespace }).VPN_DATA;
    if (!kv) return null;
    const data = await kv.get<DataFile>(DATA_KEY, { type: 'json', cacheTtl: 3600 });
    if (!data || !Array.isArray(data.entries)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function loadAllDataRuntime(): Promise<DataFile> {
  const edgeData = await loadEdgeData();
  return edgeData ?? loadAllData();
}

export function getEntries(): VpnEntry[] {
  return loadAllData().entries.filter((e) => e.isActive);
}

export async function getEntriesRuntime(): Promise<VpnEntry[]> {
  return (await loadAllDataRuntime()).entries.filter((e) => e.isActive);
}

export function getMeta(): Meta {
  return loadAllData().meta;
}

export async function getMetaRuntime(): Promise<Meta> {
  return (await loadAllDataRuntime()).meta;
}

export function getEntryById(id: string): VpnEntry | null {
  return loadAllData().entries.find((e) => e.id === id) ?? null;
}

export async function getEntryByIdRuntime(id: string): Promise<VpnEntry | null> {
  return (await loadAllDataRuntime()).entries.find((e) => e.id === id) ?? null;
}
