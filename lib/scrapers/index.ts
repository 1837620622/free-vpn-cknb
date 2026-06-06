/**
 * 抓取器注册中心
 */
import type { Scraper } from './base';
import { ygjcScraper } from './ygjc';
import { kerrynotesScraper } from './kerrynotes';
import { waiyiyuyanScraper } from './waiyiyuyan';
import { au1rxxScraper } from './au1rxx';
import { tonykongcnScraper } from './tonykongcn';
import { freenodesScraper } from './freenodes';
import { vpnpaihangScraper } from './vpnpaihang';
import { vpnbaikeScraper } from './vpnbaike';
import { everett7623Scraper } from './everett7623';
import { gfwoffScraper } from './gfwoff';
import { pandaScraper } from './panda';
import { airportAccessScraper } from './airport-access';
import { tgEnricherScraper } from './tg-enricher';

export const allScrapers: Scraper[] = [
  ygjcScraper,
  kerrynotesScraper,
  waiyiyuyanScraper,
  au1rxxScraper,
  tonykongcnScraper,
  freenodesScraper,
  vpnpaihangScraper,
  vpnbaikeScraper,
  everett7623Scraper,
  gfwoffScraper,
  pandaScraper,
  airportAccessScraper,
  tgEnricherScraper,
];

export const scraperById = (id: string): Scraper | undefined =>
  allScrapers.find((s) => s.id === id);
