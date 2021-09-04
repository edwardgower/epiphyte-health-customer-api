import ajv from './ajvInstance';

const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        lastName: {
          description: 'the last name of the customers we want to search for',
          type: 'string',
          minLength: 2,
        },
      },
      required: ['lastName'],
    },
  },
  required: ['body'],
};

export default ajv.compile(schema);
