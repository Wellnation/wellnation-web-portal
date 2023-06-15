import React from "react"
import { z } from "zod"
import { OpenAI } from "langchain/llms/openai"
import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts"
import { StructuredOutputParser, OutputFixingParser } from "langchain/output_parsers"
import { HuggingFaceInference } from "langchain/llms/hf"
import { GoogleVertexAI } from "langchain/llms/googlevertexai"
import { Cohere } from "langchain/llms/cohere"

export default async function ReportAnalysis(report) {
  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  const zparser = StructuredOutputParser.fromZodSchema(
    z.object({
      answer: z.string().describe("answer to the user's question"),
    })
  )

  const sparser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question",
  })

  const formatInstructions = zparser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template: "Answer the users question as best as possible.\n{format_instructions}\n{question}",
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
  })

  // const model = new OpenAI({
  //   model: "text-davinci-003",
  //   openAIApiKey: "",
  // })

  //   const model = new HuggingFaceInference({
  //     model: "tiiuae/falcon-7b-instruct",
  //     model: "gpt2-xl",
  //     apiKey: "",
  //   })

  //   const cohere = new Cohere({
  //     // maxTokens: 20,
  //     apiKey: "", // In Node.js defaults to process.env.COHERE_API_KEY
  //   })

  const palm = new GoogleVertexAI({
    temperature: 0.7,
  })

  const input = await prompt.format({
    question:
      "Predict accurately whether the patient shgould be categorised as critical or non-critical based on the given readings and comparing with standard values of the readings? Patient readings - Blood Pressure: Systolic Pressure (top number): 190 mmHg Diastolic Pressure (bottom number): 115 mmHg Heart Rate (Pulse): Resting heart rate: 150 beats per minute (bpm) Blood Sugar (Glucose): Fasting blood sugar:  190 mg/dL Postprandial (2 hours after a meal): 300 mg/dL.",
  })

  try {
    const result = await palm.call(input)
    console.log(result)
    // const output = sparser.parse(result)
    // console.log(output)
    return {
      report: result,
      status: "success",
    }
  } catch (err) {
    console.log(err)
    return {
      report: "Sorry, I couldn't understand that. Please try again.",
      status: "error",
    }
  }
}
