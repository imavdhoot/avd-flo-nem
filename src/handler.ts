import * as fs from "node:fs";
import { prepareSQL } from './prepareSql'
import { parseBaseDate } from './parseDate'
import type { MeterContext } from './context'
import { log } from './logger'

const MS_IN_ONE_MIN = 60_000;

export async function handler(parts: string[], ctx: MeterContext, out: fs.WriteStream) {
  const rec = parts[0];

  if (rec === "200") {
  	log(`[handler] reading 200 record:: %j`, parts)
    ctx.nmi = parts[1]?.trim() ?? null;
    ctx.interval = Number(parts[8]) || null;
    ctx.recordCount = 0;
    log(`[handler] processing NMI :: %s`, ctx.nmi);
    return;
  }

  ctx.recordCount++;
	if (rec === '500') {
		log(`[handler] processed %s records for NMI :: %s`, ctx.recordCount, ctx.nmi);
		return;
	}
  
  // Only 300 records have data we need to creating insert statement
  // so skinpping other records
  if (rec !== "300" || !ctx.nmi || !ctx.interval) return;

  const base = parseBaseDate(parts[1]);
  if (!base) return;

  for (let i = 0; i < 48 && 2 + i < parts.length; i++) {
    const raw = parts[2 + i].trim();
    
    if (!raw) continue;
    
    const val = Number(raw);
    if (Number.isNaN(val)) continue;

    const ts = new Date(base.getTime() + (i * ctx.interval * MS_IN_ONE_MIN));
    
    // if write to a sql file return buffer full
    await prepareSQL(out, ctx.nmi, ts, val);
  }

  return true;
}

