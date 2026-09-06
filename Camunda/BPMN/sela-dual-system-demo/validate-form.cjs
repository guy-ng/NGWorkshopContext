const Ajv = require('ajv');
const addErrors = require('ajv-errors');
const fs = require('fs');
const schema = require('@bpmn-io/form-json-schema/resources/schema.json');

const file = process.argv[2];

if (!file) {
  console.error('Usage: node validate-form.cjs <path-to-form.form>');
  process.exit(1);
}

let form;

try {
  form = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (error) {
  console.error(`Cannot read/parse ${file}: ${error.message}`);
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addErrors(ajv);
const validate = ajv.compile(schema);

if (!validate(form)) {
  console.error(JSON.stringify(validate.errors, null, 2));
  process.exit(1);
}

console.log(`${file}: Valid`);
