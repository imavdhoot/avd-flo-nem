import util from "node:util";

export function log(format: unknown, ...rest: unknown[]): void {
  const ts = new Date().toISOString();
  // If first arg is a string, util.format will apply % tokens.
  const body =
    typeof format === "string"
      ? util.format(format, ...rest)
      : [format, ...rest].map((v) => util.inspect(v, { depth: null })).join(" ");

  console.log(`[${ts}] ${body}`);
}