const graphql = require("graphql");

const {
  dgraphType,
  nativeDocumentType,
  libraryType
} = require("./graphql/dgraph");
const { omsType } = require("./graphql/oms");

const queryType = new graphql.GraphQLObjectType({
  name: "Query",
  fields: {
    dgraph: {
      type: dgraphType,
      args: {
        locId: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      }
    },
    oms: {
      type: omsType,
      args: {
        locId: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      }
    }
  }
});

const schema = new graphql.GraphQLSchema({
  query: queryType,
  types: [nativeDocumentType, libraryType]
});

module.exports = {
  queryType,
  schema
};
