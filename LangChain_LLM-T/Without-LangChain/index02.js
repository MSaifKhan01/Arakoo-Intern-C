

const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OpenAPI_Key;

const prompts = [
  "What is the city {person} is from? Only respond with the name of the city.",
  "What country is the city {city} in? Respond in {language}.",
];

async function generateResponse(prompt, input) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      //   body: JSON.stringify({
      //     messages: [
      //       { role: "system", content: "You are a helpful assistant." },
      //       {
      //         role: "user",
      //         content: prompt.replace(/\{(\w+)\}/g, (_, key) => input[key]),
      //       },
      //     ],
      //     max_tokens: 100, // Adjust as needed
      //   }),

      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: prompt.replace(/\{(\w+)\}/g, (_, key) => input[key]),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to get response from OpenAI: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
    // return data.choices[0].text.trim();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function generateKeywordFromSentence(sentence) {
  console.log("function called");
  // Use OpenAI API to generate a suitable keyword from the sentence
  const response = await generateResponse(sentence, {});
  //   console.log(
  //     "generateKeywordFromSentence response is: ",
  //     response.choices[0].message
  //   );
  const keyword = response.choices[0].message.content.trim();
  return keyword.toLowerCase(); // Convert to lowercase for consistency
}

// async function generateKeyword(input) {
//   let singleWord = true;
//   for (let i = 0; i < input.length; i++) {
//     if (input[i] === " ") {
//       singleWord = false;
//       break;
//     }
//   }

//   if (singleWord) {
//     console.log("if called");
//     return input.toLowerCase(); // Convert to lowercase for consistency
//   } else {
//     console.log("else called");
//     return await generateKeywordFromSentence(input);
//   }
// }

// Function to process the chain
const processChain =
  (input) =>
  async (...prompts) => {
    let result = {};

    for (const prompt of prompts) {
      const response = await generateResponse(prompt, input);
      console.log("response is : ", response.choices[0].message.content);

      //   const keyword = await generateKeywordFromSentence(
      //     prompt + response.choices[0].message.content
      //   );

      const keyword = response.choices[0].message.content;
      const SecondResponse = await generateResponse(keyword, input);
      console.log("Second Response: ", SecondResponse.choices[0].message);

      console.log("keyword is:", keyword);
      console.log("\n");

      input = {
        ...input,
        [keyword]: keyword,
      };
      result[keyword] = response;
    }

    return result;
  };

// Function to process the chain
// async function processChain(input) {
//   // Prompt 1
//   const city = await generateResponse(prompt1, input);
//   let newdata = city.choices;
//   console.log(newdata[0].message.content);

//   // Prompt 2
//   const country = await generateResponse(prompt2, {
//     city,
//     language: input.language,
//   });

//   let newCoun = country.choices[0].message.content;
//   console.log(newCoun);

//   return { city, country };
// }

// Example usage
async function run() {
  try {
    const q1 = "Where Narender modi is born?";

    const input = { Q1: `${q1}` };
    const curriedProcessChain = processChain(input);

    // Response 1 => [keyword 1] = [response 2 key]
    // User 1 prompt dega => usme se key find hogi then previous prompt key + current response match krke new keyword bengega
    const result = await curriedProcessChain(
      `${q1}`
      //   "What country is the city {city} in? Respond in {language}.Only respond with the country name in one word",
      //   "{country} has how many states?"
    );

    console.log(result);
  } catch (error) {
    console.error(`Error in chain processing: ${error.message}`);
  }
}

// Run the example
run();

// TWO PROBLEMS:
// lets say prompts does want to have a single word response
// we want to have prompts from user... which should be dynamic and in that sense,
// if want to make the keyword from that current prompt in one single word and want to give
// that to next successive prompt as the input in the dynamic variable

// Automatic keyword kaise banega
// users
// input = {
//     ...input,
//     city: response.choices[0].message.content,
//     country: response.choices[0].message.content,
//   }; // Update input for the next prompt
