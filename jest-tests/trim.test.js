const avf = require("..");
const path = require("path");
const fs = require("fs");
const { expect } = require("@jest/globals");

const testAvfTrim = async (input, start, end, checkMd5 = true) => {
  output = path.join(
    jestOutputDir,
    `${start}s-${end}s-${path.basename(input)}`
  );

  await avf.trim(input, output, start, end);

  if (fs.existsSync(output)) {
    let md5Sum = await getChecksumWithoutMeta(output).then().catch(console.log);

    return md5Sum;
  } else {
    return null;
  }
};

// Video comparison is done with md5 hashes. The md5 hashes must skip
// the first 512 bytes of the output, since that changes due to metadata
test("trim first second of replayable sample", async () => {
  const outputMd5 = await testAvfTrim(jestInputFiles.replayableSample, 0, 1);
  expect(outputMd5).toBe("55af708dee20cfaea73e5c02a8a6bae1");
});

test("trim first second of frame perfect timer example", async () => {
  const outputMd5 = await testAvfTrim(jestInputFiles.timer, 0, 1);
  expect(outputMd5).toBe("98a478257224e8765de42a5478328778");
  // human check: the video is counter from 0.0 to 0.9
});

test("trim first second of frame perfect counter example", async () => {
  const outputMd5 = await testAvfTrim(jestInputFiles.frameCounter, 0, 1);
  expect(outputMd5).toBe("dd4b886ec94ea5adb38aae84382df11c");
  // human check: the video is counter from 1 to 10
});

// //////
// // Failure conditions. The bindings should fail gracefully
// //
// // These tests are currently disabled because graceful exit is out-of-spec. Enable later
// //////
// test('ask for out-of-bounds input time', async () => {
//   const err = await testAvfTrim(jestInputFiles.replayableSample, -1, 1, checkMd5=false)
//   expect(err).toBe(null);
// });
