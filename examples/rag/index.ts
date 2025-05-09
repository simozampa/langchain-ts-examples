import "dotenv/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { Document } from "langchain/document";

export async function getContextFromVectorDb({
  query,
  namespace,
  similarityThreshold,
  numberOfResults,
}: {
  query: string;
  namespace: string;
  similarityThreshold: number;
  numberOfResults: number;
}) {
  const InputStateAnnotation = Annotation.Root({ question: Annotation<string> });
  const StateAnnotation = Annotation.Root({
    question: Annotation<string>,
    context: Annotation<Document[]>,
    answer: Annotation<string>,
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    model: "text-embedding-3-small",
    stripNewLines: true,
  });

  const pinecone = new PineconeClient();
  const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);
  const hyphenatedNamespace = namespace.replace(/ /g, "-").toLowerCase();

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    namespace: hyphenatedNamespace,
  });

  const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 });

  const promptTemplate = ChatPromptTemplate.fromMessages([
    HumanMessagePromptTemplate.fromTemplate(
      `You are an information extraction specialist. Your task is to analyze the provided context and extract ONLY the portions that are relevant to answering the given question. Do not answer the question itself.
  
  If no relevant information is found, respond with an empty string "".
  
  Question: {question}
  Context: {context}
  
  Provide a concise summary of the relevant information, including all key details and numbers.`
    ),
  ]);

  const retrieve = async (state: typeof InputStateAnnotation.State) => {
    const retrieved = await vectorStore.similaritySearchWithScore(
      state.question,
      numberOfResults
    );
    const filtered = retrieved.filter(([_, score]) => score >= similarityThreshold).map(([doc]) => doc);
    return { context: filtered };
  };

  const generate = async (state: typeof StateAnnotation.State) => {
    if (state.context.length === 0) return { answer: "" };
    const docsContent = state.context.map((d) => d.pageContent).join("");
    const messages = await promptTemplate.invoke({
      question: state.question,
      context: docsContent,
    });
    const response = await llm.invoke(messages);
    return { answer: response.content };
  };

  const graph = new StateGraph(StateAnnotation)
    .addNode("retrieve", retrieve)
    .addNode("generate", generate)
    .addEdge("__start__", "retrieve")
    .addEdge("retrieve", "generate")
    .addEdge("generate", "__end__")
    .compile();

  const result = await graph.invoke({ question: query });
  return result.answer || "";
}

// Example usage
async function main() {
  const answer = await getContextFromVectorDb({
    query: "What are the key features of AI agents?",
    namespace: "Workshop Notes",
    similarityThreshold: 0.8,
    numberOfResults: 5,
  });
  console.log("Extracted context answer:", answer);
}

main().catch(console.error);