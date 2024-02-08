import { Jsonnet } from "@hanazuki/node-jsonnet";

import { OpenAiEndpoint } from "@arakoodev/edgechains.js";
import * as path from "path";
import { Hono } from "hono";
import dotenv from "dotenv"

dotenv.config();

const jsonnet = new Jsonnet();



const promptPath = path.join(__dirname, "../src/react-chain.jsonnet");

const InterPath = path.join(__dirname, "../src/intermediate.jsonnet");

export const ReactChainRouter = new Hono();


const gpt3Endpoint = new OpenAiEndpoint(
    "https://api.openai.com/v1/chat/completions",
    process.env.OPENAI_API_KEY!,
    "",
    "gpt-4",
    "user",
    parseInt("0.7")

);

export async function reactChainCall(query: string) {
    try {
        // console.log("try called");

        const promptLoader = await jsonnet.evaluateFile(promptPath)

        const promptTemplate = JSON.parse(promptLoader).custom_template;


        let InterLoader = await jsonnet.extString("promptTemplate", promptTemplate).extString("query", query).evaluateFile(InterPath)

        const prompt = JSON.parse(InterLoader).prompt
        // console.log("JS-PROMPT", prompt);

        // console.log("PROMPT_LOADER", promptLoader);

        const gptResponse = await gpt3Endpoint.gptFn(prompt);

        const formattedResponse = gptResponse.replace(/\\n/g, '\n');
        console.log("Single--", formattedResponse);
        return formattedResponse;

    } catch (error) {

        console.error(error);
        throw error;
    }
}

// ReactChainRouter.get("/", async (res) => {


//     // let query = "Author David Chanoff has collaborated with a U.S. Navy admiral who served as the ambassador to the United Kingdom under which President?";

//     res.json({ loading: true })


//     try {
//         const ReactChainCall = await reactChainCall(query)


//         const formattedResponse = ReactChainCall.replace(/\\n/g, '\n');



//         return res.json({ answer: formattedResponse }, 200);


//     } catch (error) {
//         return res.json({ error: "An error occurred" }, 500);
//     }

// });
function UserInput(query: string) {
    // ReactChainRouter.get("/", async (res, qeury) => {
    ReactChainRouter.get("/", async (res) => {
        res.json({ loading: true });

        try {
            // Use 'query' from the function parameter
            const ReactChainCall = await reactChainCall(query);

            const formattedResponse = ReactChainCall.replace(/\\n/g, '\n');

            return res.json({ answer: formattedResponse }, 200);
        } catch (error) {
            return res.json({ error: "An error occurred" }, 500);
        }
    });
}

UserInput("what is opne ai")