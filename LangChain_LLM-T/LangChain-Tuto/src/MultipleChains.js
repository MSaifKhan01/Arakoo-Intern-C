import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const prompt1 = PromptTemplate.fromTemplate(
  `What is the city {person} is from? Only respond with the name of the city.`
);

// We call the city as states
// country United state

const prompt2 = PromptTemplate.fromTemplate(
  `What country is the city {city} in? Respond in {language}.`
);

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chain = prompt1.pipe(model).pipe(new StringOutputParser());

// 1st chain
//response is stored in chain variable

// const chain = prompt1.pipe(new StringOutputParser()).pipe(model);

// in runnable sequence, it is like the mongoDB aggregation pipelines
// in which the output of each is the input to next

// internally, RunnableSequence, changes to MAP and recieves the same parameters.

const combinedChain = RunnableSequence.from([
  {
    city: chain,
    language: (input) => input.language,
  },
  prompt2,
  model,
  new StringOutputParser(),
]);

// Map works on keys, ---> values

const result = await combinedChain.invoke({
  person: "Obama",
  language: "English",
});

console.log(result);

// PROMPT 1 ---> giving obama . getting city
// PROMPT 2 ---> giving city . getting country
