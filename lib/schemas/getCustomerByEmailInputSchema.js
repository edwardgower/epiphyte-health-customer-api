import ajv from './ajvInstance';

const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        email: {
          description: 'email address of the user you would like to search for',
          type: 'string',
          format: 'email',
        },
      },
      required: ['email'],
    },
  },
  required: ['body'],
};

export default ajv.compile(schema);
