import {ChatPromptTemplate} from "@langchain/core/prompts"

import {RunnableSequence} from "@langchain/core/runnables"

import {StringOutputParser} from "@langchain/core/output_parsers"
import dotenv from "dotenv";
import {ChatOpenAI}  from "@langchain/openai"

dotenv.config();
let prompt1= ChatPromptTemplate.fromTemplate(
    `What  is the city {person} is from? Only respond with the name of the city.`
)

let prompt2= ChatPromptTemplate.fromTemplate(
    `What country is the city {city} in? Respond in {language}.`
)

// PROMPT 1 ---> giving obama . getting city
// PROMPT 2 ---> giving city . getting country
let ChatModel= new ChatOpenAI({
    openAIApiKey:process.env.OPENAI_API_KEY
});

let OutputParsed= new StringOutputParser()
let Chain= prompt1.pipe(ChatModel).pipe(OutputParsed)

let CombinedChain= RunnableSequence.from([
    {city:Chain,
        language: (input)=>{
            return input.language
        }
    },
    prompt2,
    ChatModel,
    OutputParsed
])

let response = await CombinedChain.invoke({
    person:"Obama",
    language:"Germen",
    // language:"english"
})

// console.log("Chain is: ", Chain)
// console.log("Combined Chain is :", CombinedChain)
console.log(response)