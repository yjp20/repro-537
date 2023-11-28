"use strict";

const { Readable } = require("node:stream");
const { randomBytes } = require("node:crypto");

process.on("uncaughtException", (error) => {
  console.error("!!! UNCAUGHT EXCEPTION !!!\n", error);
  server.close();
  process.exit(1);
});

let count = 0;
main()
  .then(() => {})
  .catch(console.error);
async function main() {
  try {
    for await (const part of getStream()) {
      console.log("read part: ", count);
    }
  } catch (error) {
    console.log("error reading stream: ", error);
  }
}

function getStream() {
  return new Readable({
    read(size = 16) {
      if (count > 100) {
        throw Error("exceeded count");
      }

      const data = randomBytes(size);
      this.push(data.toString("base64"));
      count += 1;
    },
  });
}
