import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs/promises";

import { trim } from "../avf.js";

describe("trim", () => {
  it("should trim", async () => {
    const input = "test.mp4";
    const output = "test.output.mov";

    await trim(input, output, 0, 0);

    // Check the output file exists
    const exists = await fs
      .access(output, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);
    assert(exists);

    // Check the output file is not empty
    const stat = await fs.promises.stat(output);
    assert.notEqual(stat.size, 0);
  });
});
