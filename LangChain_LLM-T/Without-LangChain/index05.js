const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.OpenAPI_Key;

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
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;
  }
}

async function processChain(input, thoughtsAndActions) {
  try {
    let result = {};
    let agentChain = [];
    let thoughtCounter = 1;

    for (const { thought, action } of thoughtsAndActions) {
      // Action
      const actionResult = await generateResponse(action, input);
      console.log(
        `Action ${thoughtCounter}: ${thought}\nAction: ${action}\nResult: ${actionResult}`
      );

      // Observation
      const observation = await generateResponse(thought, input);
      console.log(`Observation ${thoughtCounter}: ${observation}\n`);

      agentChain.push({ thought: thoughtCounter, action, observation });

      input = {
        ...input,
        result: actionResult,
      };

      result[`Thought ${thoughtCounter}`] = observation;
      thoughtCounter++;
    }

    console.log("Entering new AgentExecutor chain...");
    console.log(JSON.stringify(agentChain, null, 2));

    return result;
  } catch (error) {
    console.error(`Error in chain processing: ${error.message}`);
  }
}

async function run() {
  try {
    // Example user input
    const userInput = {
      person: "David Chanoff",
      dynamicPrompt: "Who is the presedent of india with {person}?",
    };

    // Dynamically generate thoughtsAndActions based on user input
    const thoughtsAndActions = [
      {
        thought: `I need to search ${userInput.person} and the U.S. Navy admiral, find the ambassador to the United Kingdom, then find the President they served under.`,
        action: `Search [${userInput.person}]`,
      },
      {
        thought: `${userInput.dynamicPrompt}`,
        action: `Search ${userInput.dynamicPrompt}`,
      },
      // Add more dynamically generated thoughtsAndActions as needed
    ];

    const result = await processChain(userInput, thoughtsAndActions);
    console.log(result);
  } catch (error) {
    console.error(`Error in chain processing: ${error.message}`);
  }
}

run();
