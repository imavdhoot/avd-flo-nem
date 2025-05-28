import * as fs from "node:fs";


export function prepareSQL(writer: fs.WriteStream, nmi: string, ts: Date, val: number) {
  const iso = ts.toISOString().replace("T", " ").substring(0, 19);
  return writer.write(
    `INSERT INTO meter_readings (nmi, \"timestamp\", consumption) VALUES ('${nmi}', '${iso}', ${val});\n`
  );
}