import * as fs from "node:fs";
import lineReader from "line-reader";
import * as readline from "node:readline";
import { once } from "node:events";
import { handler } from './handler'
import type { MeterContext } from './context'

export async function generateInserts2(input: string, output: string): Promise<void> {
	let records = 0;
	const startTs = Date.now();
  const inStream = fs.createReadStream(input);
  console.log(`[alert] !!! processing input NEM file:: ${input}`);

  const outStream = fs.createWriteStream(output, { flags: "w" });

  const rl = readline.createInterface({ input: inStream, crlfDelay: Infinity });
  const ctx: MeterContext = { nmi: null, interval: null };

  rl.on("line", (line) => {
  	console.log("##>>", line)
  	records++;
    
    const isOk = handler(line.split(","), ctx, outStream);

    // if write is not ok then pause the reading of the file
    if (!isOk) rl.pause();
  });

  outStream.on("drain", () => {
  	console.log(`[debug] drain event — resuming`);
  	rl.resume();
  });
  
  rl.on("pause", () => {
  	console.log(`[alert] !!! pausing the read`)
  });
  rl.on("resume", () => {
  	console.log(`[alert] !!! resuming the read`)
  });

  // Wait for all lines to be processed
  await once(rl, "close");
  
	// Wait until all buffered writes are written to file
  // outStream.end();
  await new Promise((resolve) => outStream.end(resolve));

  const endTs = Date.now();
  console.log(`[alert] !!! processing done. sql insert commands output file:: ${output}`)
  console.log(`\n------ Info ------`)
  console.log(`Total records: ${records}`);
  console.log(`Total time: ${(endTs-startTs)/1000} sec`);
}

if (require.main === module) {
  const [, , inFile, outFile] = process.argv;

  // some validations
  if (!inFile) {
  	console.log('[main] input file name not given');
    console.error("Usage: node dist/generateInserts.js <input.csv> <output.sql>");
    process.exit(1);
  }

  if (!outFile) {
  	console.log('[main] output file name not given');
    console.error("Usage: node dist/generateInserts.js <input.csv> <output.sql>");
    process.exit(1);
  }

  // main function trigger
  generateInserts(inFile, outFile).catch((err) => {
  	console.error(err);
  	process.exit(1);
  });
}