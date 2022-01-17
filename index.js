const path = require("path");
const execa = require("execa");
const electronUtil = require("electron-util/node");

// Workaround for https://github.com/electron/electron/issues/9459
const BIN = path.join(electronUtil.fixPathForAsarUnpack(__dirname), "avf");

module.exports.trim = async (input, output, timeStart, timeEnd) => {
  const { stdout } = await execa(BIN, [
    "trim",
    input,
    output,
    timeStart,
    timeEnd,
  ]);
  console.log("execa avf.trim output: ", stdout);
};

module.exports.snapshot = async (input, output, milliSeconds) => {
  const { stdout } = await execa(BIN, ["snapshot", input, output, milliSeconds]);
  console.log("execa avf.snapshot output: ", stdout);
};
