const avf = require('..')
const path = require('path')
const crypto = require('crypto');
const fs = require('fs');
const { expect } = require('@jest/globals');

// The verbose filenames are important because we may add support for different 
// codecs, containers, framerates, etc. in the future. 
const avfTrimFirstSecond = async () => {
  const inFile = path.join(__dirname,'input','1440x900_yuv420p_h264_10fps.mp4')
  const outFile = path.join(__dirname,'output','1440x900_yuv420p_h264_10fps_1s.mp4')
  fs.mkdir(path.dirname(outFile), (err) => {})

  await avf.trim(inFile, outFile, 0, 1)

  let md5Sum = await getChecksumWithoutMeta(outFile)
    .then()
    .catch(console.log);

  return md5Sum 
};

// NOTE: we skip the fist 512 bytes when calculating the md5 because those  
// bytes contain metadata including the date, which changes every time you run
// the trim function. The rest of the file is completely static, and the 
// known-good hash was calculated with the same method, making a match during 
// testing possible
function getChecksumWithoutMeta(path) {
  return new Promise(function (resolve, reject) {
    const hash = crypto.createHash('md5');
    const input = fs.createReadStream(path, { highWaterMark: 512 });

    let i = 0;
    input.on('error', reject);
    input.on('data', function (chunk) {
      i++;
      // this is where we skip the first 512 bytes
      if (i>1){
        hash.update(chunk);
      } 
    });

    input.on('close', function () {
      resolve(hash.digest('hex'));
    });
  });
}

// Test Bodies. We are currently testing trimming a known video to the
// first 1 second, then comparing it to an md5 hash of a known-good result
test('trim to one second, check output against known good result', async () => {
  const outputMd5 = await avfTrimFirstSecond()
  expect(outputMd5).toBe("482976f166cb6c4777ca893194124db8");
});


