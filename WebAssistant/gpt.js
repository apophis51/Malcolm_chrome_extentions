import{ Configuration, OpenAIApi } from "openai";


const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
apiKey: "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"
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
//   messages: [{"role": "system", "content": "You are a helpful assistant."}, {role: "user", content: "Hello world"}],
  messages: [{"role": "system", "content": "what is 2+2."}]
});
 console.log(completion.data.choices[0].message);
 console.log("look",configuration.apiKey)
