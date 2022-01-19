const avf = require("..");
const path = require("path");
const fs = require("fs");
const { expect } = require("@jest/globals");

const testGif = async (input) => {
    output = path.join(
        jestOutputDir,
        `${path.basename(input, path.extname(input))}.gif`
    );
    await avf.gif(input, output);
    if (fs.existsSync(output)) {
        return getChecksum(output).then().catch(console.log);
    } else {
        return null;
    }
};

test("test create gif from timer", async () => {
    const outputMd5 = await testGif(jestInputFiles.timer);
    expect(outputMd5).toBe("8c9f5d81962561fd4a085bf8020b9993");
});
