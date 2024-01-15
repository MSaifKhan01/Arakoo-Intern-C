import dotenv from "dotenv";
dotenv.config();

// import { ChatOpenAI } from "@langchain/openai";
// import { WikipediaQueryRunParams } from "@langchain/community/tools/wikipedia_query_run";
// import {
//   initializeAgentExecutor,
//   Toolkit,
//   AgentExecutor,
// } from "langchain/agents";
// import { DocstoreExplorer } from "@langchain/core/documents";
// const docstore = new DocstoreExplorer(Wikipedia());
// const tools = [
//   new Toolkit({
//     name: "Search",
//     func: docstore.search,
//     description: "Search for a term in the docstore.",
//   }),
//   new Toolkit({
//     name: "Lookup",
//     func: docstore.lookup,
//     description: "Lookup a term in the docstore.",
//   }),
// ];



// const llm = new ChatOpenAI({
//   modelName: "gpt-3.5-turbo-1106",
//   temperature: 0,
//   openaiApiKey: process.env.OPENAI_API_KEY,
// });

// const react = initializeAgentExecutor(tools, llm, {
//   AgentExecutor: "react-docstore",
//   verbose: true,
// });

// const agentExecutor = AgentExecutor.fromAgentAndTools(react.agent, tools, {
//   verbose: true,
// });

// const question =
//   "Author David Chanoff has collaborated with a U.S. Navy admiral who served as the ambassador to the United Kingdom under which President?";

// agentExecutor.run(question);

// NEW DOCS CODE HERE



import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { pull } from "langchain/hub";
import { OpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";

// const tools = [
//   new TavilySearchResults({
//     maxResults: 1,
//     apiKey: process.env.TAVILY_API,
//   }),
// ];

// USING WIKIPEDIA HERE TO GET RESULT
// IF WE WANT TO GET AWAIT TOOLS.CALL TO BE EXECUTED , REMOVE SQUARE BRACKETS FROM NEXT LINE
const tools = [
  new WikipediaQueryRun({
    topKResults: 3,
    maxDocContentLength: 4000,
  }),
];

// const res = await tools.call("langchain");
// console.log("res is :", res);

const prompt = await pull("hwchase17/react");
const llm = new OpenAI({
  modelName: "gpt-3.5-turbo-instruct",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const agent = await createReactAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
  verbose: true,
});

const result = await agentExecutor.invoke({
  input:
    "Author David Chanoff has collaborated with a U.S. Navy admiral who served as the ambassador to the United Kingdom under which President?",
});

console.log(result);
