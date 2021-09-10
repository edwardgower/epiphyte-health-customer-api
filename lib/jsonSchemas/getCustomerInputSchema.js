import ajv from './ajvInstance';
// this schema defines a way for the client to determine which fileds it would like returned in the customer object.
const schema = {
  type: 'object',
  properties: {
    pathParameters: {
      description: 'the parameters passed in the url',
      type: 'object',
      properties: {
        id: {
          description: 'the uuid representing the customer id',
          type: 'string',
          format: 'uuid',
        },
      },
    },
    body: {
      description: 'the body of the http request',
      type: 'object',
      default: {},
      properties: {
        customerId: {
          description: 'internal id for the customer',
          type: 'boolean',
          default: true,
        },
        externalId: {
          description: 'externalId for the customer',
          type: 'boolean',
          default: false,
        },
        ssn: {
          description: "last 4 digits of the customer's social security number",
          type: 'boolean',
          default: false,
        },
        username: {
          description: 'username for the customer',
          type: 'boolean',
          default: false,
        },
        email: {
          description: 'email for the customer',
          type: 'boolean',
          default: true,
        },
        title: {
          description: 'title for the customer',
          type: 'boolean',
          default: false,
        },
        firstName: {
          description: 'first name for the customer',
          type: 'boolean',
          default: true,
        },
        middleName: {
          description: 'middle name for the customer',
          type: 'boolean',
          default: false,
        },
        lastName: {
          description: 'last name for the customer',
          type: 'boolean',
          default: true,
        },
        suffix: {
          description: "suffix of the customer's name",
          type: 'boolean',
          default: false,
        },
        gender: {
          description: 'gender of the customer',
          type: 'boolean',
          default: false,
        },
        dateOfBirth: {
          description: "customer's date of birth",
          type: 'boolean',
          default: false,
        },
        addresses: {
          description: 'addresses for the customer',
          type: 'boolean',
          default: false,
        },
        phoneNumbers: {
          description: 'customer phone numbers',
          type: 'boolean',
          default: false,
        },
        createdAt: {
          description: 'timestamp for when the customer was created',
          type: 'boolean',
          default: false,
        },
        updatedAt: {
          description: 'timestamp for when the customer was last updated',
          type: 'boolean',
          default: true,
        },
      },
      required: [
        'customerId',
        'externalId',
        'ssn',
        'username',
        'email',
        'title',
        'firstName',
        'middleName',
        'lastName',
        'suffix',
        'gender',
        'dateOfBirth',
        'addresses',
        'phoneNumbers',
        'createdAt',
        'updatedAt',
      ],
    },
  },
  required: ['pathParameters', 'body'],
};

export default ajv.compile(schema);
