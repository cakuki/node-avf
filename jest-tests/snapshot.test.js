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
    let md5Sum = await getChecksum(output).then().catch(console.log);

    return md5Sum;
  } else {
    return null;
  }
};

test("test capture snapshot from replayable sample at 1 second", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.replayableSample, 400);
  expect(outputMd5).toBe("NO KNOWN GOOD HASH");
});

test("test capture snapshot from timer at 1 second", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.timer, 1);
  expect(outputMd5).toBe("NO KNOWN GOOD HASH");
  // human test: .png should be a picture of "0.9" (currently does not)
});

test("test capture snapshot from frame counter at 1 second", async () => {
  const outputMd5 = await testSnapshot(jestInputFiles.frameCounter, 1);
  expect(outputMd5).toBe("NO KNOWN GOOD HASH");
  // human test: .png should be a picture of "10" (currently does not)
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
