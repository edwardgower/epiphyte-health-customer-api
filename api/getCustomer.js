import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import { getCustomerById } from '../lib/getCustomerById';
import getCustomerInputSchema from '../lib/jsonSchemas/getCustomerInputSchema';

async function getCustomer(event, context) {
  // create the response variables
  let body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  let customer;

  try {
    const { id } = event.pathParameters;
    customer = await getCustomerById(id);
    console.log('*** getCustomer with Expression ***');
    console.log(customer);
  } catch (error) {
    throw new createError.InternalServerError(error);
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

export const handler = commonMiddleware(getCustomer).use(
  validator({
    inputSchema: getCustomerInputSchema,
    ajvInstance: ajv,
  })
);
