import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import { getCustomerById } from '../lib/getCustomerById';
import getCustomerInputSchema from '../lib/jsonSchemas/getCustomerInputSchema';
import { convertDynamoObjectToClientObject } from '../lib/convertDynamoObjectToClientObject';
import { customerDynamoDbSchema } from '../lib/dynamoDbSchemas/customerDynamoDbSchema';

async function getCustomer(event, context) {
  // create the response variables
  let body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  let customer;

  try {
    const { id } = event.pathParameters;
    const dynamoCustomerObject = await getCustomerById(id, event.body);

    console.log(event);

    // convert the dynamodb object to a client object
    customer = await convertDynamoObjectToClientObject(
      dynamoCustomerObject,
      customerDynamoDbSchema.clientFieldsMap
    );
  } catch (error) {
    throw new createError.InternalServerError(error);
  } finally {
    // build the response in the schema the client expects
    body = JSON.stringify({
      customer,
    });
  }

  return {
    statusCode,
    body,
    headers,
  };
}

export const handler = commonMiddleware(getCustomer).use(
  validator({
    inputSchema: getCustomerInputSchema,
    ajvInstance: ajv,
  })
);
