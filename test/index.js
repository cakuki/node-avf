import { trim } from "../avf.js";

async function test() {
  const input = "test.mp4";
  const output = "test.output.mp4";
  await trim(input, output, "00:00:00", "00:00:05");
}

await test();
