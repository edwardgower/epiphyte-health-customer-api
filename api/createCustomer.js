import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/schemas/ajvInstance';
import createCustomerInputSchema from '../lib/schemas/createCustomerInputSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createCustomer(event, context) {
  // create the response variables
  let body;
  let statusCode = 201;
  const headers = { 'Content-Type': 'application/json' };

  // parse the incoming body using middy
  const { email, firstName, lastName } = event.body;
  // create the internal consts
  const customerId = uuid();
  const timeNow = new Date();

  // insert the customer of catch the errors
  try {
    // need to tranactionally write the email address to a seperate collection to ensure uniqueness
    await dynamodb
      .transactWrite({
        TransactItems: [
          {
            Put: {
              Item: {
                // add the customer item to the collection
                PK: 'C#' + customerId,
                SK: 'C#' + customerId,
                Type: 'Customer',
                ID1: customerId,
                ID5: email,
                // todo add in GSI population for email (GSI2) and last name (GSI3)
                Name2: firstName,
                Name4: lastName,
                Created: timeNow.toISOString(),
                Updated: timeNow.toISOString(),
                // GSI2 - email address - ID5 in table
                GSI2PK: 'EM#' + email,
                GSI2SK: 'EM#' + email,
                GSI3PK: 'LN#',
                GSI3SK: 'LN#' + lastName,
              },
              TableName: process.env.CUSTOMERS_TABLE_NAME,
              ConditionExpression: 'attribute_not_exists(PK)',
            },
          },
          {
            Put: {
              // add the customers email to the collection to ensure uniqueness
              Item: {
                PK: 'C#' + email,
                SK: 'C#' + email,
                Type: 'Customer Email',
                ID1: customerId,
                ID5: email,
                Created: timeNow.toISOString(),
                Updated: timeNow.toISOString(),
              },
              TableName: process.env.CUSTOMERS_TABLE_NAME,
              ConditionExpression: 'attribute_not_exists(PK)',
            },
          },
        ],
      })
      .promise();
  } catch (err) {
    console.log(event);
    console.log(err);
    // todo: log errors specific to the reasons, i.e. let the client know if validation failed or transaction failed
    throw new createError.InternalServerError(err);
  } finally {
    // build the response in the schema the client expects
    body = JSON.stringify({
      customerId,
      email,
      firstName,
      lastName,
    });
  }

  return {
    statusCode,
    body,
    headers,
  };
}

export const handler = commonMiddleware(createCustomer).use(
  validator({
    inputSchema: createCustomerInputSchema,
    ajvInstance: ajv,
  })
);

//export const handler = createCustomer;
