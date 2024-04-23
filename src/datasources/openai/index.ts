import OpenAI from "openai";

const openai = new OpenAI();

const constructQuestion = (statements) => {
  return `Can you return a comma separated list (without whitespaces and first letter should be a capital letter) of proffessions in Swedish (without English translation) for a person who has the following traits: ${statements.join(
    ", "
  )}`;
};

export const getChatCompletions = async (statements) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: constructQuestion(statements) }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};
