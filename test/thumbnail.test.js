const test = require("node:test");
const assert = require("node:assert");
const { deriveImage } = require("../dist/utilities/thumbnail");

test("derives a YouTube thumbnail", () => {
  assert.strictEqual(deriveImage("YoutubeLink", "https://www.youtube.com/watch?v=Ke90Tje7VS0"), "https://img.youtube.com/vi/Ke90Tje7VS0/hqdefault.jpg");
  assert.strictEqual(deriveImage("YoutubeLink", "https://youtu.be/Z-0CJGI6m6A"), "https://img.youtube.com/vi/Z-0CJGI6m6A/hqdefault.jpg");
});
test("no image for other types or bad links", () => {
  assert.strictEqual(deriveImage("link", "https://example.com"), undefined);
  assert.strictEqual(deriveImage("YoutubeLink", "not a url"), undefined);
});
