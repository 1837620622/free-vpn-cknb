/**
 * 全站主题：每种 type 独特颜色 + icon + label + 描述
 * 用于 Section / Card / Nav 高亮
 */
import type { VpnType } from './types';

export interface TypeTheme {
  id: VpnType;
  label: string;
  plural: string;
  color: string;
  colorDim: string;
  bg: string;
  border: string;
  text: string;
  desc: string;
}

export const TYPE_THEMES: Record<VpnType, TypeTheme> = {
  trial: {
    id: 'trial',
    label: '试用机场',
    plural: '试用',
    color: '#76B900',
    colorDim: 'rgba(118,185,0,0.15)',
    bg: 'rgba(118,185,0,0.08)',
    border: 'rgba(118,185,0,0.25)',
    text: '#A4E26B',
    desc: '注册即得流量或试用期限',
  },
  free: {
    id: 'free',
    label: '免费机场',
    plural: '免费',
    color: '#3B82F6',
    colorDim: 'rgba(59,130,246,0.15)',
    bg: 'rgba(59,130,246,0.08)',
    border: 'rgba(59,130,246,0.25)',
    text: '#7BAEF7',
    desc: '有免费套餐或长期免费节点',
  },
  node: {
    id: 'node',
    label: '实时节点',
    plural: '节点',
    color: '#A855F7',
    colorDim: 'rgba(168,85,247,0.15)',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
    text: '#C7A2F9',
    desc: '公开 clash/v2ray/ss 订阅',
  },
  review: {
    id: 'review',
    label: '机场评测',
    plural: '评测',
    color: '#F59E0B',
    colorDim: 'rgba(245,158,11,0.15)',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    text: '#FBBF63',
    desc: '精选机场深度评测与横评',
  },
  index: {
    id: 'index',
    label: '机场索引',
    plural: '索引',
    color: '#06B6D4',
    colorDim: 'rgba(6,182,212,0.15)',
    bg: 'rgba(6,182,212,0.08)',
    border: 'rgba(6,182,212,0.25)',
    text: '#5DD2EE',
    desc: '权威机场索引与导航',
  },
  dead: {
    id: 'dead',
    label: '跑路机场',
    plural: '跑路',
    color: '#EF4444',
    colorDim: 'rgba(239,68,68,0.15)',
    bg: 'rgba(239,68,68,0.08)',
    border: 'rgba(239,68,68,0.25)',
    text: '#F87171',
    desc: '已确认跑路或长期不可用',
  },
};

export function getTheme(type: string): TypeTheme {
  return TYPE_THEMES[type as VpnType] || TYPE_THEMES.review;
}
