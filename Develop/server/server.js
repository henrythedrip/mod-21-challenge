const express = require("express");
const path = require("path");
const db = require("./config/connection");
const resolvers = require("./resolvers");
const typeDefs = require("./types");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { authMiddleware, signToken } = require("./utils/auth");

const app = express();
const PORT = process.env.PORT || 3001;

const server = new ApolloServer({ typeDefs, resolvers, introspection: true });

const startServer = async () => {
  await server.start();
  console.log(signToken({ username: "username" }));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: authMiddleware,
    })
  );

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/dist/index.html"));
    });
  }

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

startServer();