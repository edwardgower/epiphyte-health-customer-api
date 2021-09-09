import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import getCustomersByLastNameInputSchema from '../lib/jsonSchemas/getCustomersByLastNameInputSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCustomersByLastName(event, context) {
  // create the response variables
  let body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  let customers;
  // parse the incoming body using middy
  const { lastName } = event.body;
  // set lastName to lower case to match the index in createCustomer
  const lastNameLower = lastName.toLowerCase();

  const params = {
    TableName: process.env.CUSTOMERS_TABLE_NAME,
    IndexName: 'GSI3',
    KeyConditionExpression: '#GSI3PK = :PK AND begins_with(#GSI3SK, :SK)',
    ExpressionAttributeNames: {
      '#GSI3PK': 'GSI3PK',
      '#GSI3SK': 'GSI3SK',
    },
    ExpressionAttributeValues: {
      ':PK': 'LN#',
      ':SK': 'LN#' + lastNameLower,
    },
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log(result);
    customers = result.Items.map((item) => {
      // iterate each item in the array and transform the schema to a valid return value.
      const customer = {};

      customer.customerId = item.ID1;
      customer.email = item.ID5;
      customer.firstName = item.Name2;
      customer.lastName = item.Name4;

      return customer;
    });
  } catch (error) {
    console.log(error);
    throw new createError.NotFound(
      // todo this error handling needs to be refactored. this is a missleading error.
      `Customers with the last name: ${lastName} not found!`
    );
  } finally {
    // build the response in the schema the client expects
    body = JSON.stringify({
      customers,
    });
  }

  return {
    statusCode,
    body,
    headers,
  };
}

export const handler = commonMiddleware(getCustomersByLastName).use(
  validator({
    inputSchema: getCustomersByLastNameInputSchema,
    ajvInstance: ajv,
  })
);
