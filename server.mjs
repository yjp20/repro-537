import http from "node:http";
import { Readable } from "node:stream";
import { randomBytes } from "node:crypto";

let count = 0;
const stream = new Readable({
  read(size = 16) {
    if (count >= 100) {
      throw Error("exceeded count");
    }

    const bytes = randomBytes(size);
    const chunk = JSON.stringify({
      id: "chatcmpl-8MzOfSMbLxEy70lYAolSwdCzfguQZ",
      object: "chat.completion.chunk",
      // 2023-11-20T09:00:00-05:00
      created: 1700488800,
      model: "gpt-4",
      choices: [
        {
          index: 0,
          finish_reason: null,
          delta: { role: "assistant", content: bytes.toString("base64") },
        },
      ],
    });

    this.push("data: " + chunk + "\n\n");
    count += 1;
  },
});

const server = await new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    stream.pipe(res);
  });
  server.listen({ host: "127.0.0.1", port: 3001 }, () => {
    resolve(server);
  });
});

process.on("uncaughtException", (error) => {
  console.error("!!! UNCAUGHT EXCEPTION !!!\n", error);
  server.close();
  process.exit(1);
});
