const avf = require('..')
const path = require('path')
const crypto = require('crypto');
const fs = require('fs');
const { expect } = require('@jest/globals');

const x = async () => {
  const inFile = path.join(
    __dirname,
    'input',
    '1440x900_yuv420p_h264_10fps.mp4',)
  const outFile = path.join(
    __dirname,
    'output',
    '1440x900_yuv420p_h264_10fps_1s.mp4',)
  console.log(inFile,outFile)
  await avf.trim(inFile, outFile, 0, 1)

  let md5Sum = await getChecksumWithoutMeta(outFile)
    .then()
    .catch();

  return md5Sum 
};

test('trim to one second, check equal to known good output', async () => {
  const outputMd5 = await x()
  expect(outputMd5).toBe("482976f166cb6c4777ca893194124db8");
});


function getChecksumWithoutMeta(path) {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash('md5');
    const input = fs.createReadStream(path, { highWaterMark: 512 });
    let i = 0;
    input.on('error', reject);

    input.on('data', function (chunk) {
      i++;
      // cheap code to strip first 512 byts, which contain metadata
      if (i>1){
        hash.update(chunk);
      } 
    });

    input.on('close', function () {
      resolve(hash.digest('hex'));
    });
  });
}