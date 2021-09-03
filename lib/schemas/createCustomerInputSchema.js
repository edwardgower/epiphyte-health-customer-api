import ajv from './ajvInstance';

const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        email: {
          description:
            'email address of the user. this has to be unique across the service',
          type: 'string',
          format: 'email',
        },
        firstName: {
          description: 'the first name of the customer',
          type: 'string',
          minLength: 2,
          //default: 'eDDo!',
        },
        lastName: {
          description: 'the last name of the customer',
          type: 'string',
          minLength: 2,
        },
      },
      required: ['email', 'firstName', 'lastName'],
    },
  },
  required: ['body'],
};

export default ajv.compile(schema);
