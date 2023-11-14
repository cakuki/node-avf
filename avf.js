import { promisify } from "node:util";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const execP = promisify(exec);

const BIN_PATH =
  process.env.AVF_BIN_PATH || fileURLToPath(new URL("avf", import.meta.url));

export async function trim(input, output, timeStart, timeEnd) {
  const { stdout } = await execP(
    [BIN_PATH, "trim", input, output, timeStart, timeEnd].join(" ")
  );
  console.log(stdout);
}
