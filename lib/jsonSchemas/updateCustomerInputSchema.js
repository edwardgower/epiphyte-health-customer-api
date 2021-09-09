import ajv from './ajvInstance';
// all non-key fields can be updated here. All key fields need a specialized update.
// adresses, phoneNumbers need to be added

const schema = {
  //$id: 'http://json-schema.org/draft-04/schema#',
  //$id: 'https://epiphytehealth.com/schemas/customer/update-customer-input-schema',
  //$schema: 'http://json-schema.org/draft-04/schema#',
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          description: 'title the customer uses',
          type: 'string',
          enum: [
            'Dr.',
            'Ind.',
            'M',
            'Misc',
            'Miss',
            'Mr.',
            'Mrs.',
            'Ms.',
            'Mx',
          ],
        },
        firstName: {
          description: 'the first name of the customer',
          type: 'string',
          minLength: 2,
          //default: 'eDDo!',
        },
        middleName: {
          description: 'the middle name of the customer',
          type: 'string',
          minLength: 2,
        },
        suffix: {
          description: 'suffix the customer uses',
          type: 'string',
          // folling enum definition throws a validation error
          // enum: [
          //   'Jr',
          //   'Sr',
          //   'I',
          //   'II',
          //   'III',
          //   'IV',
          //   'V',
          //   'VI',
          //   'VII',
          //   'VII',
          //   'VIII',
          // ],
        },
        gender: {
          description: 'gender of the customer',
          type: 'string',
          enum: ['Female', 'Male', 'Non-Binary'],
        },
        dateOfBirth: {
          description: 'customer date of birth in the YYYY-MM-DD format',
          type: 'string',
          format: 'date',
        },
      },
      required: ['gender'],
    },
  },
  required: ['body'],
};

export default ajv.compile(schema);
