import OpenAI from "openai";

process.on("uncaughtException", (error) => {
  console.error("!!! UNCAUGHT CLIENT EXCEPTION !!!\n", error);
  process.exit(1);
});

const openai = new OpenAI({
  baseURL: `http://127.0.0.1:3001/v1`,
  apiKey: "super-secret",
});

const response = await openai.chat.completions.create({
  messages: [{ role: "user", content: "foo" }],
  stream: true,
});

try {
  for await (const chunk of response) {
    console.log("got chunk:", chunk);
  }
} catch (error) {
  console.error("got expected error:", error);
}

