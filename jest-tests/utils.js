const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

global.jestInputDir = path.join(__dirname, "input");
global.jestOutputDir = path.join(__dirname, "output");

global.jestInputFiles = {
  replayableSample: path.join(jestInputDir, "replayable_sample_10fps_6s.mp4"),
  timer: path.join(jestInputDir, "timer_60s_10fps.mp4"),
  frameCounter: path.join(jestInputDir, "frame_counter_60s_10fps.mp4"),
};

fs.mkdir(jestOutputDir, (err) => {});
// NOTE: we skip the first N bytes when calculating the md5 because those
// bytes contain metadata including the date, which changes every time you run
// the trim function. The rest of the file is completely static, and the
// known-good hash was calculated with the same method, making a match during
// testing possible
global.getChecksumWithoutMeta = (path, metaByteSize = 512) => {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash("md5");
    const input = fs.createReadStream(path, { highWaterMark: metaByteSize });

    let i = 0;
    input.on("error", reject);
    input.on("data", function (chunk) {
      i++;
      // this is where we skip the first 512 bytes
      if (i > 1 || metaByteSize === 0) {
        hash.update(chunk);
      }
    });

    input.on("close", function () {
      resolve(hash.digest("hex"));
    });
  });
};

global.getChecksum = (path) => {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash("md5");
    const input = fs.createReadStream(path);

    input.on("error", reject);
    input.on("data", function (chunk) {
      hash.update(chunk);
    });

    input.on("close", function () {
      resolve(hash.digest("hex"));
    });
  });
};
