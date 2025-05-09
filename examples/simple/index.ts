import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

async function main() {
  const model = new ChatOpenAI({ temperature: 0.7 });
  const messages = [
    new SystemMessage("You are a helpful assistant."),
    new HumanMessage("What's the weather like in New York today?"),
  ];

  const response = await model.call(messages);
  console.log("Assistant:", response.content);
}

main().catch(console.error);
