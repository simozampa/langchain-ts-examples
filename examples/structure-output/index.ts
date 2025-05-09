import "dotenv/config";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

async function main() {
  const joke = z.object({
    setup: z.string().describe("The setup of the joke"),
    punchline: z.string().describe("The punchline to the joke"),
    rating: z
      .number()
      .optional()
      .describe("How funny the joke is, from 1 to 10"),
  });

  const structuredLlm = model.withStructuredOutput(joke);

  const response = await structuredLlm.invoke("Tell me a joke about cats");
  console.log("Parsed output:", response);
}

main().catch(console.error);
