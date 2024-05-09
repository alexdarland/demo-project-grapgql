import OpenAI from "openai";
import { swedishProffessions } from "./swedish-proffessions";

const openai = new OpenAI();

export const getSuggestionsByStatements = async (statements: string[]) => {
  const constructQuestion = (statements: string[]) => {
    return `Här är en lista med yrken: ${swedishProffessions.join(
      ", "
    )}. En person har följande egenskaper: ${statements.join(
      ", "
    )}. Vilka yrken skulle passa denna peson bäst? Sortera på relevans, välj dom 10 bästa matchningarna och returnera dessa i en kommaseparerad lista som är formaterad så här: "yrke1,yrke2,yrke3"`;
  };

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: constructQuestion(statements) }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};

interface PersonalityScores {
  practical: number;
  caring: number;
  analytical: number;
  driven: number;
  artistic: number;
  organized: number;
}

export const getSuggestionsByPersonalityScores = async (statements) => {
  const constructQuestion = (personalityScores: PersonalityScores) => {
    return `Här är en lista med yrken: ${swedishProffessions.join(
      ", "
    )}. En person får poäng (max 100) i följande egenskaper. Praktisk: ${
      personalityScores.practical
    }, Omsorgsfull: ${personalityScores.caring}, Analytisk: ${
      personalityScores.analytical
    }, Driven: ${personalityScores.driven}, Konstnärlig: ${
      personalityScores.artistic
    }, Ordningsam: ${
      personalityScores.organized
    }. Vilka av ovnnämnade yrken skulle passa denna peson bäst? Sortera på relevans, välj dom 10 bästa matchningarna och returnera enbart en lista som är formaterad så här: "yrke1,yrke2,yrke3". Ingen dialog, inga komentarer, bara en kommaseparerad lista!`;
  };

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: constructQuestion(statements) }],
    model: "gpt-3.5-turbo",
  });

  return completion;
};
