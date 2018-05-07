const http = require("http");
const request = require("request");

/**
 * Executes a standard GET request but returns a promise.
 * @param _options Object containing request parameters.
 */
function getJSON(options) {
  return new Promise((resolve, reject) => {
    http
      .get(options, res => {
        const { statusCode } = res;
        const contentType = res.headers["content-type"];

        let error;
        if (statusCode !== 200) {
          error = new Error(`Request Failed. Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
          error = new Error(
            `Invalid content-type. Expected application/json but received ${contentType}`
          );
        }
        if (error) {
          // consume response data to free up memory
          res.resume();
          reject(error);
        }

        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData);
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function postData(options, data) {
  return new Promise((resolve, reject) => {
    request.post(
      `http://${options.hostname}:${options.port}${options.path}`,
      {
        json: true,
        body: data
      },
      (err, resp, req) => {
        if (err) {
          reject(err);
        }
        resolve(resp.body);
      }
    );
  });
}

module.exports = postData;
