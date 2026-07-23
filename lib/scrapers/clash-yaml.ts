/**
 * Clash YAML 节点解析工具
 * 解析标准 Clash 配置文件中的 proxies 数组，供多个节点类爬虫复用
 * 支持三种格式：
 * 1. 块格式零缩进：- name: xxx（行首），属性 2 空格缩进
 * 2. 块格式双缩进：  - name: xxx（2 空格），属性 4 空格缩进
 * 3. JSON flow 格式：- {name: xxx, server: xxx, ...}（单行 JSON）
 */
import type { VpnEntry } from '../types';
import { makeId } from '../format';

export interface ClashNode {
  name: string;
  server: string;
  port: number;
  type: string;
  cipher?: string;
  network?: string;
}

/**
 * 从 Clash YAML 文本中提取 proxies 列表
 */
export function parseClashYaml(yaml: string, maxNodes = 300): ClashNode[] {
  const out: ClashNode[] = [];
  const lines = yaml.split('\n');

  // 定位顶层 proxies: 起始行（行首无缩进，避免匹配 proxy-groups 内部的子级 proxies）
  let i = lines.findIndex((l) => /^proxies:\s*$/.test(l));
  if (i < 0) return out;
  i++;

  while (i < lines.length && out.length < maxNodes) {
    const line = lines[i];

    // 遇到顶层键（无缩进且不是列表项），proxies 段结束
    if (/^\S/.test(line) && !line.startsWith('-') && line.trim() !== '') break;

    // 格式 3：JSON flow 格式 "- {name: ..., server: ...}"
    const flowMatch = line.match(/^\s*-\s*\{(.+)\}\s*$/);
    if (flowMatch) {
      const node = parseFlowNode(flowMatch[1]);
      if (node) out.push(node);
      i++;
      continue;
    }

    // 格式 1/2：块格式 "- key: value"
    const itemMatch = line.match(/^(\s*)-\s+(\w[\w-]*):\s*(.*)$/);
    if (itemMatch) {
      const indent = itemMatch[1].length;
      const obj: Record<string, string> = {};
      obj[itemMatch[2]] = stripQuotes(itemMatch[3]);
      i++;

      // 解析后续属性行：缩进必须大于列表项缩进
      const propIndent = indent + 2;
      const propRegex = new RegExp(`^\\s{${propIndent},}([\\w-]+):\\s*(.*)$`);
      while (i < lines.length) {
        const propMatch = lines[i].match(propRegex);
        // 遇到下一个列表项或缩进不足时停止
        if (!propMatch || /^\s*-/.test(lines[i])) break;
        obj[propMatch[1]] = stripQuotes(propMatch[2]);
        i++;
      }

      if (obj.name && obj.server) {
        out.push({
          name: obj.name,
          server: obj.server,
          port: Number(obj.port ?? 0),
          type: (obj.type ?? 'unknown').toLowerCase(),
          cipher: obj.cipher,
          network: obj.network,
        });
      }
    } else {
      i++;
    }
  }

  return out;
}

/**
 * 解析 JSON flow 格式的节点（单行）
 * 两种变体：
 * - 标准 JSON（带引号键）：{"name":"xxx","server":"yyy","port":443}
 * - YAML flow（无引号键）：{name: xxx, server: yyy, port: 443}
 */
function parseFlowNode(content: string): ClashNode | null {
  let obj: Record<string, unknown> | null = null;

  // 优先尝试标准 JSON 解析（FreeSub 等带引号键的格式）
  try {
    const parsed = JSON.parse('{' + content + '}');
    if (parsed && typeof parsed === 'object') obj = parsed as Record<string, unknown>;
  } catch {
    // 回退到正则提取（clashfree 等无引号键的格式）
    obj = {};
    const kvRegex = /([\w-]+):\s*("[^"]*"|'[^']*'|[^,}]+)/g;
    let m: RegExpExecArray | null;
    while ((m = kvRegex.exec(content)) !== null) {
      obj[m[1]] = stripQuotes(m[2].trim());
    }
  }

  if (!obj) return null;
  const name = String(obj.name ?? '');
  const server = String(obj.server ?? '');
  if (name && server) {
    return {
      name,
      server,
      port: Number(obj.port ?? 0),
      type: String(obj.type ?? 'unknown').toLowerCase(),
      cipher: obj.cipher ? String(obj.cipher) : undefined,
      network: obj.network ? String(obj.network) : undefined,
    };
  }
  return null;
}

function stripQuotes(s: string): string {
  return s.trim().replace(/^["']|["']$/g, '');
}

/**
 * 将 ClashNode 列表转为 VpnEntry 数组（节点类条目）
 */
export function clashNodesToEntries(
  nodes: ClashNode[],
  opts: {
    sourceId: string;
    subscriptionUrl: string;
    scrapedAt: string;
  }
): VpnEntry[] {
  return nodes.map((n) => ({
    id: makeId(n.name, n.server),
    name: n.name,
    type: 'node' as const,
    description: `${n.type.toUpperCase()} · ${n.server}:${n.port}`,
    subscriptionUrl: opts.subscriptionUrl,
    subscriptionFormats: ['clash'],
    protocols: [n.type],
    nodeCount: 1,
    status: 'live' as const,
    sources: [opts.sourceId],
    sourceUrls: [opts.subscriptionUrl],
    publishedAt: opts.scrapedAt,
    scrapedAt: opts.scrapedAt,
    isActive: true,
  }));
}
