const graphql = require("graphql");

const omsSignatureType = new graphql.GraphQLObjectType({
  name: "omsSignature",
  fields: {
    id: {
      type: graphql.GraphQLInt
    }
  }
});

const sourceType = new graphql.GraphQLObjectType({
  name: "source",
  fields: {
    locId: {
      type: graphql.GraphQLString,
      resolve: s => {
        return s.loc_id;
      }
    }
  }
});

const targetType = new graphql.GraphQLObjectType({
  name: "target",
  fields: {
    locId: {
      type: graphql.GraphQLString,
      resolve: s => {
        return s.loc_id;
      }
    }
  }
});

const mappingsType = new graphql.GraphQLObjectType({
  name: "mappings",
  fields: {
    name: { type: graphql.GraphQLString },
    displayName: {
      type: graphql.GraphQLString,
      resolve: s => {
        return s.display_name;
      }
    },
    source: { type: sourceType },
    target: { type: targetType },
    mappingType: {
      type: graphql.GraphQLString,
      resolve: s => {
        return s.mapping_type;
      }
    }
  }
});

const originEnum = new graphql.GraphQLEnumType({
  name: "OmsOrigin",
  values: {
    SOURCE: { value: 0 },
    TARGET: { value: 1 }
  }
});

const omsType = new graphql.GraphQLObjectType({
  name: "OMS",
  fields: {
    name: {
      type: graphql.GraphQLNonNull(graphql.GraphQLString),
      resolve: source => {
        return source.name;
      }
    },
    displayName: {
      type: graphql.GraphQLString,
      resolve: source => {
        return source.display_name;
      }
    },
    nameExtension: {
      type: graphql.GraphQLString,
      resolve: s => {
        return s.name_extension;
      }
    },
    omsSignature: {
      type: omsSignatureType,
      resolve: s => {
        return s.oms_signature;
      }
    },
    mappings: {
      type: graphql.GraphQLList(mappingsType),
      args: {
        origin: { type: originEnum }
      },
      resolve: (s, a) => {
        if (a.origin === 1) {
          return s.mappings_target;
        } else {
          return s.mappings_source;
        }
      }
    }
  }
});

module.exports = {
  omsType
};
