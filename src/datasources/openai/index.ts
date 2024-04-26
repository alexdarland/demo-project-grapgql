import OpenAI from "openai";
import { swedishProffessions } from "./swedish-proffessions";

const openai = new OpenAI();

const constructQuestion = (statements) => {
  return `Här är en lista med yrken: ${swedishProffessions.join(
    ", "
  )}. En person har följande egenskaper: ${statements.join(
    ", "
  )}. Vilka yrken skulle passa denna peson bäst? Sortera på relevans, välj dom 10 bästa matchningarna och returnera dessa i en kommaseparerad lista som är formaterad så här: "yrke1,yrke2,yrke3"`;
};

export const getChatCompletions = async (statements) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: constructQuestion(statements) }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};
