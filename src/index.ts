import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import dotenv from "dotenv";
import cors from "cors";
import corsOptions from "./config/corsOptions";
import { json } from "body-parser";
import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { getSession } from "next-auth/react";
import { GraphQLContext } from "./util/types";
import { PrismaClient } from "@prisma/client";
import { Session } from "./util/types";

async function main() {
  dotenv.config();
  const app = express();
  //   Context
  const prisma = new PrismaClient();

  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }): Promise<GraphQLContext> => {
        const session = (await getSession({ req })) as Session;
        return { session, prisma };
      },
    })
  );
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: 5000 }, resolve);
  });
  console.log(`🚀 Server ready at http://localhost:5000/graphql`);
}

main().catch((err) => console.log(err));
