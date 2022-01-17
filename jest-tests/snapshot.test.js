const avf = require("..");
const path = require("path");
const fs = require("fs");
const { expect } = require("@jest/globals");

const testSnapshot = async (input, time) => {
  output = path.join(
    jestOutputDir,
    `${time}s-${path.basename(input, path.extname(input))}.png`
  );

  await avf.snapshot(input, output, time);

  if (fs.existsSync(output)) {
    return getChecksum(output).then().catch(console.log);
  } else {
    return null;
  }
};

test("test capture snapshot from replayable sample at 1 s", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.replayableSample, 1);
  expect(outputMd5).toBe("9629b5bc575afcff9c812706e88f3ad3");
  // human test: .png should contain a timer value of "1s 31"
});

test("test capture snapshot from timer at 1 s", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.timer, 1);
  expect(outputMd5).toBe("14c6d6461889c6ec344fac0c0b3fd996");
  // human test: .png should be a picture of "1.0"
});

test("test capture snapshot from frame counter at 1.5 s", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.frameCounter, 1.5);
  expect(outputMd5).toBe("b1e802bd125fb116f68c45a7a0e079b5");
  // human test: .png should be a picture of "16"
});

// //////
// // Failure conditions. The bindings should fail gracefully
// //
// // These tests are currently disabled because graceful exit is out-of-spec. Enable later
// //////
// test('ask for out-of-bounds time', async () => {
//   const err = await testSnapshot(jestInputFiles.replayableSample, -1)
//   expect(err).toBe(null);
// });
