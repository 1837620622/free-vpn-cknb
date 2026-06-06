/**
 * 数据读取：data/vpns.json
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { VpnEntry, Meta, DataFile } from './types';

const DATA_PATH = join(process.cwd(), 'data', 'vpns.json');

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

export function getEntries(): VpnEntry[] {
  return loadAllData().entries.filter((e) => e.isActive);
}

export function getMeta(): Meta {
  return loadAllData().meta;
}

export function getEntryById(id: string): VpnEntry | null {
  return loadAllData().entries.find((e) => e.id === id) ?? null;
}
