import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";

dotenv.config();

const outputParser = new StringOutputParser();
const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

let SimplePromptRespone = await chatModel.invoke("What is sharding?");
// console.log("SimplePromptRespone: ", SimplePromptRespone);

const TemplatePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are world class mathematician"], // SystemPropmtTemplate
  ["user", "{input}"], // HumanPromptTemplate
]);

// console.log("prompt is : ", prompt.promptMessages);
// console.log("prompt is : ", prompt.promptMessages[1].prompt.lc_namespace);

// USER INPUT ====> ChatPromptTemplate.fromMessages ===> Modification ===> Modified String ===> LLM's

// const chain = prompt.pipe(chatModel.bind({ stop: ["\n"] })).pipe(outputParser);

// in the runnable interface  -> templatePrompt ----> chatmodelAPI ---> stringOutputParse
// const chain = TemplatePrompt.pipe(chatModel).pipe(outputParser);

const FIrstchain = TemplatePrompt.pipe(chatModel).pipe(outputParser);
const Secondchain = TemplatePrompt.pipe(outputParser);

// console.log("Firstchain is : ", FIrstchain);
// console.log("Secondchain is : ", Secondchain);

// in the first template ---> First: Template
// Last: OpenAI

// int the second template ---> First: Template
// Last: OutputParse

// Runnnable interface is automatically figuring out
// in the second stage, we expect model

// Chatmodel in pipelin

// ChatModel(chatModel)
// outputParser

// Next pipeline is dependent on the previous pipeline, and there are specfic methods that we can apply

let TemplateResponse = await FIrstchain.invoke({
  input: "What is pythagoras theorem?",
});

// let TemplateResponse =await FIrstchain.invoke()
console.log("TemplateResponse is:", TemplateResponse);
