import Express  from "express"; 



import cors from "cors"

import { ChatOpenAI } from "@langchain/openai";
import {StringOutputParser} from "@langchain/core/output_parsers"

import {ChatPromptTemplate} from "@langchain/core/prompts"
import dotenv from "dotenv"

dotenv.config()

const app=Express()

app.use(Express.json())

app.use(cors())
app.post("/", async(req,res)=>{

    
const outputParser= new StringOutputParser()


const chatModel= new ChatOpenAI({

    openAIApiKey:process.env.OpenAI_Key

})

const prompt= ChatPromptTemplate.fromMessages([
    ["system","You are a mention so act as Developer"],
    ["user","{input}"]
])

const chain = prompt.pipe(chatModel).pipe(outputParser)

const response= await chain.invoke({
    input:`{what is jamal meaning in urdu}`
})

// let inputValue="what is saif meaning in urdu"
// const prompt = `You are a mentor so act as Developer. ${inputValue}`;

// const chain= chatModel.pipe(outputParser)

// const response= await chain.invoke({
//     prompt:prompt
// })

console.log(response)
res.send(response)
})
app.listen(4000,()=>{
console.log("running server on port 4000")
})




