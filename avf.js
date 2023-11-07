import { promisify } from "node:util";
import { exec } from "node:child_process";
import { fileURLToPath } from "node:url";

const execP = promisify(exec);

const binary = new URL("avf", import.meta.url);

export async function trim(input, output, timeStart, timeEnd) {
  const { stdout } = await execP(
    [fileURLToPath(binary), "trim", input, output, timeStart, timeEnd].join(" ")
  );
  console.log(stdout);
}
