import * as fs from "node:fs";
import lineReader from "line-reader";
import * as readline from "node:readline";
import { once } from "node:events";
import { handler } from './handler'
import type { MeterContext } from './context'
import { log } from './logger'

export async function generateInserts(input: string, output: string): Promise<void> {
  let records = 0;
  const startTs = Date.now();
  const outStream = fs.createWriteStream(output, { flags: "w" });

  const ctx: MeterContext = { nmi: null, interval: null, recordCount: 0, totalIntervals: 0 };

  log(`[generateInserts] !!! processing input: ${input}`);

  await new Promise<void>((resolve, reject) => {
    lineReader.eachLine(input, async (line, last, cb) => {
      // log('### ', line)
      try {
        records++;
        await handler(line.split(","), ctx, outStream);

        if (!last) {
          //local call of this line so next line gets processed
          cb?.();
          return;         
        }

        // last line processing 
        outStream.end(() => {
          const endTs = Date.now();
          log(`[generateInserts] !!! processing done. sql insert commands output file:: ${output}`)
          console.log(`\n------------ Info ------------`)
          console.log(`Total records: ${records}`);
          console.log(`Total time: ${(endTs-startTs)/1000} sec`);
          resolve();
        });        
      } catch (err) {
        log(`[generateInserts] Error in processing: `, err);
        reject(err);
      }
    });
  });
}


if (require.main === module) {
  const [, , inFile, outFile] = process.argv;

  if (!inFile) {
    log('[main] input file name not given');
    console.error("Usage: node dist/generateInserts.js <input.csv> <output.sql>");
    process.exit(1);
  }

  if (!outFile) {
    log('[main] output file name not given');
    console.error("Usage: node dist/generateInserts.js <input.csv> <output.sql>");
    process.exit(1);
  }

  // main function trigger
  generateInserts(inFile, outFile).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}