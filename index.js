const https = require("https");
const app = require("./app");
var fs = require("fs");

// const { API_PORT } = process.env;
const PORT = process.env.PORT || 4001;
var https_options = {
  cert: fs.readFileSync("../arduino-service/certificate.crt"),
  key: fs.readFileSync("../arduino-service/private.key"),
  ca: fs.readFileSync("../arduino-service/ca_bundle.crt"),
};

const server = https.createServer(https_options, app);
server.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
