const { createServer } = require("node:http");
const { createYoga } = require("graphql-yoga");
const { applyMiddleware } = require("graphql-middleware");
const { PrismaClient } = require("@prisma/client");
const { schema } = require("./schema");
const permissions = require("./permissions");

const prisma = new PrismaClient();
const yoga = createYoga({
  schema: applyMiddleware(schema, permissions),
  context: { prisma },
});
const server = createServer(yoga);

server.listen(4000, () => {
  console.info("Server is running on http://localhost:4000/graphql");
});
