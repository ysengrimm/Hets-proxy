const getJson = require("./helper/getJSON");

const config = {
  hostname: "172.16.186.129",
  port: 8000,
  path: "/graphql"
};

async function fetchDGraph(file) {
  const data = await getJson(config, {
    query: "query DGraph",
    variables: {
      locId: file
    }
  });

  return data;
}

async function fetchOMS(id) {
  const data = await getJson(config, {
    query: "query OMS",
    variables: {
      locId: id
    }
  });

  return data;
}

const root = {
  dgraph: params => {
    return fetchDGraph(params.locId).then(data => {
      const dgraph = data.data.dgraph;

      // reshape data as the json keys don't match the graphql querry id's
      dgraph.oms_list.forEach(e => {
        e.locId = e.loc_id;
        e.displayName = e.display_name;
        e.nameExtension = e.name_extension;
        e.nameExtensionIndex = e.name_extension_index;
        e.labelHasFree = e.label_has_free;
        e.labelHasHiding = e.label_has_hiding;
      });

      return {
        name: dgraph.name,
        version: ~~dgraph.version,
        displayName: dgraph.display_name,
        oms: dgraph.oms_list
      };
    });
  },
  oms: params => {
    return fetchOMS(params.locId)
      .then(data => {
        if (data.data === undefined) {
          return { name: "Database Error" };
        }
        const oms = data.data.oms;

        return {
          name: oms.name
        };
      })
      .catch(err => {
        console.log(err);
        return {
          name: "error"
        };
      });
  }
};

module.exports = root;
