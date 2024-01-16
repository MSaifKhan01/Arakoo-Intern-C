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

const processChain =
  (input) =>
  async (...prompts) => {
    let result = {};

    for (const prompt of prompts) {
      const response = await generateResponse(prompt, input);
      console.log("response is : ", response.choices[0].message.content);

      input = {
        ...input,
        city: response.choices[0].message.content,
        country: response.choices[0].message.content,
      }; // Update input for the next prompt
      result[prompt] = response;
    }

    return result;
  };

// Example usage
async function run() {
  try {
    const input = { person: "Narender Modi", language: "English" };

    const curriedProcessChain = processChain(input);

    const result = await curriedProcessChain(
      "What is the city {person} is from? Only respond with the name of the city.",
      "What country is the city {city} in? Respond in {language}.Only respond with the country name in one word",
      "{country} has how many states?"
    );

    console.log(result);
  } catch (error) {
    console.error(`Error in chain processing: ${error.message}`);
  }
}

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
