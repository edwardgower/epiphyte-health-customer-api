import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { getCustomerById } from '../lib/getCustomerById';

async function getCustomer(event, context) {
  // create the response variables
  let body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  let customer;

  try {
    const { id } = event.pathParameters;
    customer = await getCustomerById(id);
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

export const handler = commonMiddleware(getCustomer);
