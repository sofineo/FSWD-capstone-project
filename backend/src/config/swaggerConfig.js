const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");

module.exports = swaggerDocument;