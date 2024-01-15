import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// VECTOR_STORE [RETRIEVAL STORES]---> EMBEDDINGS [] --> PROMPT ---> MODEL --> OUTPUT_PARSERS

const vectorStore = await MemoryVectorStore.fromTexts(
  [
    "mitochondria is the powerhouse of the cell",
    "lysosomes are the garbage disposal of the cell",
    "the nucleus is the control center of the cell",
  ],
  [{ id: 1 }, { id: 2 }, { id: 3 }],
  new OpenAIEmbeddings()
);

console.log(vectorStore);

const retriever = vectorStore.asRetriever();

const prompt =
  ChatPromptTemplate.fromTemplate(`Answer the question based only on the following context:
{context}

Question: {question}`);

const serializeDocs = (docs) => docs.map((doc) => doc.pageContent).join("\n");

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(serializeDocs),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke("What is the garbage disposal of the cell?");

console.log(result);
