LangChain TypeScript Examples Repository
========================================

A collection of **runnable** examples showcasing key [LangChain](https://github.com/langchain-ai/langchain) features using TypeScript.

Table of Contents
-----------------

1.  Prerequisites

2.  Setup

3.  Examples

4.  Configuration

* * * * *

Prerequisites
-------------

-   Node.js v16 or later

-   npm (comes with Node.js)

-   A code editor (e.g., VS Code)

Setup
-----

1.  **Clone the repository**

```
git clone <repo-url> langchain-ts-examples
cd langchain-ts-examples
```

2.  **Install dependencies**

```
npm install
```

3.  **Environment variables**

-   Copy `.env.example` to `.env`

-   Fill in your API keys:

```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index
ANTHROPIC_API_KEY=your_anthropic_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Examples
--------

Each example can be run with:

```
npx ts-node <path-to-example>/index.ts
```

### 1\. Simple LLM Call

Location: `examples/simple/index.ts`

-   Demonstrates a basic chat call with OpenAI's ChatOpenAI.

### 2\. Structured Output Parsing

Location: `examples/structured-output/index.ts`

-   Uses `zod` schemas and `StructuredOutputParser` to enforce and parse structured JSON output from an LLM.

### 3\. Retrieval-Augmented Generation (RAG)

Location: `examples/rag/index.ts`

-   Shows how to retrieve context from a Pinecone vector store and feed it to a ChatOpenAI model via a `StateGraph`.

### 4\. Custom Tool Example

Location: `examples/tool-example/index.ts`

-   Defines a simple uppercase conversion tool and uses LangChain's agent executor for zero-shot tool execution.

### 5\. LangGraph Agent

Location: `examples/langgraph-agent/agent.ts`

-   Builds an autonomous multi-step agent using LangGraph, integrating a third-party search tool via `ToolNode`.

Configuration Files
-------------------

-   `**package.json**`: sets up scripts and dependencies

-   `**tsconfig.json**`: TypeScript compiler options

-   `**.env.example**`: template for environment variables