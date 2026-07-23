/**
 * 复制按钮（客户端组件）：复制订阅链接到剪贴板
 * 详情页是服务端组件，onClick 必须放在独立的 'use client' 组件中
 */
'use client';

import { useState } from 'react';
import { IconCopy } from './Icon';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }
        } catch {}
      }}
      className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold rounded-md border border-border-strong text-fg-strong hover:bg-bg-elev transition-colors"
    >
      <IconCopy width={13} height={13} /> {copied ? '已复制' : '复制订阅'}
    </button>
  );
}
