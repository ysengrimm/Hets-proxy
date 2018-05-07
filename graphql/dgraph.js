const graphql = require("graphql");

const originEnum = new graphql.GraphQLEnumType({
  name: "Origin",
  values: {
    SOURCE: { value: 0 },
    TARGET: { value: 1 }
  }
});

const locationType = new graphql.GraphQLObjectType({
  name: "Location",
  fields: {
    locId: { type: graphql.GraphQLString }
  }
});

const documentLinkType = new graphql.GraphQLObjectType({
  name: "DocumentLink",
  fields: {
    source: { type: locationType },
    target: { type: locationType }
  }
});

const omsType = new graphql.GraphQLObjectType({
  name: "Oms",
  fields: {
    locId: { type: graphql.GraphQLNonNull(graphql.GraphQLString) },
    name: { type: graphql.GraphQLString },
    displayName: { type: graphql.GraphQLString },
    nameExtension: { type: graphql.GraphQLString },
    nameExtensionIndex: { type: graphql.GraphQLInt },
    origin: { type: graphql.GraphQLString },
    labelHasFree: { type: graphql.GraphQLBoolean },
    labelHasHiding: { type: graphql.GraphQLBoolean }
  }
});

const dgraphType = new graphql.GraphQLInterfaceType({
  name: "DGraph",
  fields: {
    version: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    displayName: { type: graphql.GraphQLString },
    locId: { type: graphql.GraphQLString },
    documentLinks: {
      type: documentLinkType,
      args: {
        limit: { type: graphql.GraphQLInt },
        origin: { type: originEnum }
      }
    }
  },
  resolveType: value => {
    if (value.oms && value.oms.length === 1) {
      return nativeDocumentType;
    }
    if (value.oms && value.oms.length > 0) {
      return libraryType;
    }
  }
});

const libraryType = new graphql.GraphQLObjectType({
  name: "Library",
  interfaces: [dgraphType],
  fields: {
    version: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    displayName: { type: graphql.GraphQLString },
    locId: { type: graphql.GraphQLString },
    documentLinks: {
      type: documentLinkType,
      args: {
        limit: { type: graphql.GraphQLInt },
        origin: { type: originEnum }
      }
    },
    oms: {
      type: graphql.GraphQLList(omsType),
      args: {
        limit: { type: graphql.GraphQLInt }
      },
      resolve: (source, args, context, info) => {
        return source.oms;
      }
    }
  }
});

const nativeDocumentType = new graphql.GraphQLObjectType({
  name: "NativeDocument",
  interfaces: [dgraphType],
  fields: {
    version: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    displayName: { type: graphql.GraphQLString },
    locId: { type: graphql.GraphQLString },
    documentLinks: {
      type: documentLinkType,
      args: {
        limit: { type: graphql.GraphQLInt },
        origin: { type: originEnum }
      }
    },
    oms: {
      type: omsType,
      resolve: (_, args) => {
        return "";
      }
    }
  }
});

module.exports = {
  dgraphType,
  libraryType,
  nativeDocumentType
};
