import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";

const typeDefs = `#graphql
  type Query {
    Suggestions(statements: [String]!): Suggestions
  }
  
  type Suggestions {
    proffessions: [String],
    educations: [Educations],
  }

  type Educations {
    name: String,
    type: String,
    url: String,
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    Suggestions: () => {
      return {
        proffessions: ["Läkare", "Programmerare", "Musiker"],
        educations: [
          {
            name: "Musikmakarna 80p",
            type: "Universitet",
            url: "http://www.test.com",
          },
        ],
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

  app.use(cors(), bodyParser.json(), expressMiddleware(server));

  await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
  console.log(`🚀 Server ready at http://localhost:${port}`);

  return httpServer;
}
