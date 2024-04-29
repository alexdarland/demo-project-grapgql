import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import http from "http";
import cors from "cors";
import * as openai from "../datasources/openai";

const typeDefs = `#graphql
  type Query {
    SuggestionsByStatements(statements: [String]!): Suggestions
    SuggestionsByPersonalityScores(practical: Int!, caring: Int!, analytical: Int!, driven: Int!, artistic: Int!, organized: Int!): Suggestions
  }
  
  type Suggestions {
    proffessions: [String]
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    SuggestionsByStatements: async (
      _,
      { statements },
      { dataSources: { openai } }
    ) => {
      const result = await openai.getSuggestionsByStatements(statements);
      const parsedResult =
        result?.choices[0]?.message?.content?.split(",") || [];

      return {
        proffessions: parsedResult,
      };
    },
    SuggestionsByPersonalityScores: async (
      _,
      { practical, caring, analytical, driven, artistic, organized },
      { dataSources: { openai } }
    ) => {
      const result = await openai.getSuggestionsByPersonalityScores({
        practical,
        caring,
        analytical,
        driven,
        artistic,
        organized,
      });
      const parsedResult =
        result?.choices[0]?.message?.content?.split(",") || [];

      return {
        proffessions: parsedResult,
      };
    },
  },
};

export async function startApolloServer(port: string | number = 8001) {
  const app = express();
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(express.json());
  app.use(cors());
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async () => {
        return {
          dataSources: {
            openai,
          },
        };
      },
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}`);

  return httpServer;
}
