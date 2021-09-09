// add an instance of ajv for use with middy validator. this allows us to compile the schema
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true, useDefaults: 'empty' }); // had to set it to empty to get defaults to be applied.
addFormats(ajv);

export default ajv;
