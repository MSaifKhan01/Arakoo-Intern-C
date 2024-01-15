import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config();

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const functionSchema = [
  {
    name: "joke",
    description: "A joke",
    parameters: {
      type: "object",
      properties: {
        setup: {
          type: "string",
          description: "The setup for the joke",
        },
        punchline: {
          type: "string",
          description: "The punchline for the joke",
        },
      },
      required: ["setup", "punchline"],
    },
  },
  {
    name: "anecdote",
    description: "An anecdote",
    parameters: {
      type: "object",
      properties: {
        question: {
          type: "string",
          description:
            "A question setting up the anecodte, starting with the words 'Did you know that'",
        },
        answer: {
          type: "string",
          description:
            "A follow-up to the question, elaborating the anecdote, starting with the words 'It's true!'",
        },
      },
      required: ["question", "answer"],
    },
  },
];

// when giving this line to below [ ["user", `Tell me a joke & anecdote about {input}`],]
// then in this , if we do not specify the function_call parameter, then

const prompt = ChatPromptTemplate.fromMessages([
  ["user", `Tell me {speechUnit} about {subject}`],
]);

const Jokechain = prompt.pipe(
  chatModel.bind({
    functions: functionSchema,
  })
);

let jokeresponse = await Jokechain.invoke({
  speechUnit: "simple joke",
  subject: "lion",
});

// IN JOKES

// 1st ----> SETUP
// 2nd ----> punchline

console.log("jokeresponse is:", jokeresponse);

// We don't need to specify the function_call arguments separately, langchain automatically
// understands that user is trying to call joke from the user input string [based on pattern matching]

// const chain = prompt.pipe(
//   chatModel.bind({
//     functions: functionSchema,
//     // function_call: { name: "anecdote" },
//   })
// );

// // console.log("Chain is:", chain);

// let response = await chain.invoke({
//   input: "lion",
// });

// console.log("response is:", response);

// ======================================================
// TEST CASE 1

// const Jokechain = prompt.pipe(
//   chatModel.bind({
//     functions: functionSchema,
//   })
// );

// let jokeresponse = await Jokechain.invoke({
//   speechUnit: "a joke",
//   subject: "lion",
// });

// console.log("jokeresponse is:", jokeresponse);

// TEST CASE 2

// const anecdoteChain = prompt.pipe(
//   chatModel.bind({
//     functions: functionSchema,
//   })
// );

// let anecdoteResponse = await anecdoteChain.invoke({
//   speechUnit: "a anecdote",
//   subject: "monkey",
// });

// console.log("anecdoteResponse is:", anecdoteResponse);

// TEST CASE 3

// const RiddleChain = prompt.pipe(
//   chatModel.bind({
//     functions: functionSchema,
//   })
// );

// let RiddleResponse = await RiddleChain.invoke({
//   speechUnit: "a riddle",
//   subject: "monkey",
// });

// console.log("RiddleResponse is:", RiddleResponse);
