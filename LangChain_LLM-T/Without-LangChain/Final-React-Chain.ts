import { Jsonnet } from "@hanazuki/node-jsonnet";
import { OpenAiEndpoint } from "@arakoodev/edgechains.js";
import * as path from "path";
import { Hono } from "hono";
import axios from "axios";
import dotenv from "dotenv"

dotenv.config();

const jsonnet = new Jsonnet();

// jsonnet.nativeCallback(
//     "udf.fn",
//     async (prompt) => {
//         const wikiResponse = await axios
//             .post(
//                 "https://en.wikipedia.org/w/api.php",
//                 {},
//                 {
//                     params: {
//                         action: "query",
//                         prop: "extracts",
//                         format: "json",
//                         titles: prompt,
//                         explaintext: "",
//                     },
//                     headers: {
//                         "content-type": "application/x-www-form-urlencoded",
//                         Accept: "application/json",
//                     },
//                 }
//             )
//             .then(function (response) {
//                 if (response.data.query == undefined) return "";
//                 else return Object.values(response.data.query.pages);
//             })
//             .catch(function (error) {
//                 if (error.response) {
//                     console.log("Server responded with status code:", error.response.status);
//                     console.log("Response data:", error.response.data);
//                 } else if (error.request) {
//                     console.log("No response received:", error.request);
//                 } else {
//                     console.log("Error creating request:", error.message);
//                 }
//             });

//         if (wikiResponse == "") {
//             return "";
//         } else {
//             if (wikiResponse[0].extract == undefined) {
//                 return "";
//             }
//             return wikiResponse[0].extract;
//         }
//     },
//     "prompt"
// );

let reactChainJsonnetPath = path.join(__dirname, "../src/react-chain.jsonnet");
export const ReactChainRouter = new Hono();


const gpt3Endpoint = new OpenAiEndpoint(
    "https://api.openai.com/v1/chat/completions",
    process.env.OPENAI_API_KEY!,
    "",
    "gpt-3.5-turbo",
    "user",
    parseInt("0.7")
);


let apiKey: string = process.env.OPENAI_API_KEY ?? "";
let orgId: string = process.env.OPENAI_ORG_ID ?? "";




export async function ReactChainCall(apiKey: string , orgId: string){
    try {
        console.log("try called");
        // const gpt3endpoint = new OpenAiEndpoint(
        //     "https://api.openai.com/v1/chat/completions",
        //     apiKey,
        //     orgId,
        //     "gpt-3.5-turbo",
        //     "user",
        //     parseInt("0.7")
        // );
        

        const promptPath = path.join(__dirname, "../src/react-chain2.jsonnet");
        const hydePath = path.join(__dirname, "../src/hydechain2.jsonnet");


        let query = "Author David Chanoff has collaborated with a U.S. Navy admiral who served as the ambassador to the United Kingdom under which President?";
        // const promptLoader = await jsonnet.extString(promptTemplate).extString("query", "query").evaluateFile(promptPath);
        
        const promptLoader = await jsonnet.evaluateFile(promptPath)
        const promptTemplate = JSON.parse(promptLoader).custom_template;


        let hydeLoader = await jsonnet.extString("promptTemplate",promptTemplate).extString("query", query).evaluateFile(hydePath)

        const prompt = JSON.parse(hydeLoader).prompt
        console.log("JS-PROMPT", prompt);
        

        // console.log("PROMPT_LOADER", promptLoader);

        const gptResponse = await gpt3Endpoint.gptFn(prompt);


        console.log(gptResponse);
        return gptResponse
        

       
    } catch (error) {
        // Handle errors here
        console.error(error);
        throw error;
    }
}

ReactChainRouter.get("/", async (c) => {
    // const query = await c.req.json();
    const reactResponse = await ReactChainCall(apiKey, orgId);

    return c.json({ answer: reactResponse }, 200);
});



// export async function reactChain(query) {
//     var reactJsonnet = await jsonnet
//         .extString("gptResponse", "")
//         .extString("context", "This is contenxt")
//         .evaluateFile(reactChainJsonnetPath);

//     var context = "";

//     var preset = JSON.parse(reactJsonnet).preset;

//     query = preset + "\nQuestion: " + query;

//     var gptResponse = await gpt3Endpoint.gptFn(query);

//     console.log(gptResponse);

//     context = context + query;

//     jsonnet.extString("context", context).extString("gptResponse", gptResponse);

//     while (!checkIfFinished(gptResponse)) {
//         reactJsonnet = await jsonnet.evaluateFile(reactChainJsonnetPath);
//         query = JSON.parse(reactJsonnet).prompt;

//         gptResponse = await gpt3Endpoint.gptFn(query);

//         console.log(gptResponse);

//         context += "\n" + query;
//         jsonnet.extString("context", context).extString("gptResponse", gptResponse);
//     }

//     console.log(gptResponse);

//     var res = gptResponse.substring(gptResponse.indexOf("Finish["));
//     return res.substring(res.indexOf("[") + 1, res.indexOf("]"));
// }

// function checkIfFinished(response: string) {
//     return response.includes("Finish");
// }
