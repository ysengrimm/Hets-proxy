const graphql = require("graphql");

const omsType = new graphql.GraphQLObjectType({
  name: "OMS",
  fields: {
    name: {
      type: graphql.GraphQLNonNull(graphql.GraphQLString),
      resolve: source => {
        return source.name;
      }
    }
  }
});

module.exports = {
  omsType
};
