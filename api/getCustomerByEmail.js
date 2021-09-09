import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import getCustomerByEmailInputSchema from '../lib/jsonSchemas/getCustomerByEmailInputSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCustomerByEmail(event, context) {
  // create the response variables
  let body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  let customer;
  // parse the incoming body using middy
  const { email } = event.body;
  const emailToLower = email.toLowerCase();

  const params = {
    TableName: process.env.CUSTOMERS_TABLE_NAME,
    IndexName: 'GSI2',
    KeyConditionExpression: 'GSI2PK = :email',
    ExpressionAttributeValues: { ':email': 'EM#' + emailToLower },
  };

  try {
    const result = await dynamodb.query(params).promise();
    console.log(result);
    // we can jsut return the first item of the array as email is unique
    customer = result.Items[0];
  } catch (error) {
    console.log(error);
    throw new createError.NotFound(
      `Customer with Email Address: ${email} not found!`
    );
  } finally {
    // build the response in the schema the client expects
    body = JSON.stringify({
      customerId: customer.ID1,
      email: customer.ID5,
      firstName: customer.Name2,
      lastName: customer.Name4,
    });
  }

  return {
    statusCode,
    body,
    headers,
  };
}

export const handler = commonMiddleware(getCustomerByEmail).use(
  validator({
    inputSchema: getCustomerByEmailInputSchema,
    ajvInstance: ajv,
  })
);
