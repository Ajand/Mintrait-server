import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import typeDefs from "./src/typeDefs.js";
import resolvers from "./src/resolvers.js";
import config from "./config.js";

mongoose.connect(config.MONGO_CONNECTION_URL);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

// TODO: Change this asap
const JWT_SECRET = "somesimpleteststringforsecretthatwillbechanged";

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    if (!req.headers.authorization) {
      return {};
    }
    const decode = jwt.verify(req.headers.authorization, JWT_SECRET);

    return { userId: new mongoose.Types.ObjectId(decode._id._id) };
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
