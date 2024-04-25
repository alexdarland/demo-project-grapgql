import OpenAI from "openai";
import { swedishProffessions } from "./swedish-proffessions";

const openai = new OpenAI();

const constructQuestion = (statements) => {
  return `Här är en lista med yrken: ${swedishProffessions.join(
    ", "
  )}. En person har följande egenskaper: ${statements.join(
    ", "
  )}. Vilket yrke skulle passa denna peson bäst? Välj 5 alternativ och förklara varför du valde just dessa.`;
};

export const getChatCompletions = async (statements) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: constructQuestion(statements) }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};
