import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getCustomerById } from '../lib/getCustomerById';
import { generateUpdateQuery } from '../lib/generateUpdateQuery';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import updateCustomerInputSchema from '../lib/jsonSchemas/updateCustomerInputSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCustomer(event, context) {
  const { id } = event.pathParameters;
  let body = event.body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };

  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = await generateUpdateQuery(body);

  // get the customer item - error handling compeleted by getCustomerById
  const customer = await getCustomerById(id);

  console.log(customer);

  const params = {
    TableName: process.env.CUSTOMERS_TABLE_NAME,
    Key: {
      PK: 'C#' + id,
      SK: 'C#' + id,
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW',
  };

  let updatedCustomer;

  try {
    const result = await dynamodb.update(params).promise();
    updatedCustomer = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  } finally {
    body = JSON.stringify({
      updatedCustomer,
    });
  }

  return {
    statusCode,
    body,
    headers,
  };
}

export const handler = commonMiddleware(updateCustomer).use(
  validator({
    inputSchema: updateCustomerInputSchema,
    ajvInstance: ajv,
  })
);
