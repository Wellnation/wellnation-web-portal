const { z } = require("zod")
const { PromptTemplate } = require("langchain/prompts")
const { StructuredOutputParser, OutputFixingParser } = require("langchain/output_parsers")
const { GoogleVertexAI } = require("langchain/llms/googlevertexai")


module.exports = async function ReportAnalysis(report) {
  // We can use zod to define a schema for the output using the `fromZodSchema` method of `StructuredOutputParser`.
  const zparser = StructuredOutputParser.fromZodSchema(
    z.string().describe("answer to the user's question")
  )

  const sparser = StructuredOutputParser.fromNamesAndDescriptions({
    answer: "answer to the user's question",
  })

  const formatInstructions = zparser.getFormatInstructions()

  const prompt = new PromptTemplate({
    template: "Answer the users question as best as possible.\n{format_instructions}\nPredict accurately whether the patient should be categorised as critical or non-critical based on the given readings and report details by comparing with standard values of the readings? Patient readings - {question}\nAnalyze the report and give a brief summary",
    inputVariables: ["question"],
    partialVariables: { format_instructions: formatInstructions },
  })

  const palm = new GoogleVertexAI({
    temperature: 0.7,
  })

  const input = await prompt.format({
    question: report
  })
  console.log(report)
  try {
    const result = await palm.call(input)
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
