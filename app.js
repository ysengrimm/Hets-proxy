const express = require("express");
const graphqlHTTP = require("express-graphql");

const { schema } = require("./schema");
const root = require("./fetcher");

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

app.listen(8040);
console.log("Running a GraphQL API server at localhost:8040/graphql");
