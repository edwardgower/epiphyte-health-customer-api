import AWS from 'aws-sdk';
import _ from 'lodash';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import validator from '@middy/validator';
import ajv from '../lib/jsonSchemas/ajvInstance';
import updateCustomerInputSchema from '../lib/jsonSchemas/updateCustomerInputSchema';
import { getCustomerById } from '../lib/getCustomerById';
import { generateUpdateQuery } from '../lib/generateUpdateQuery';
import { customerDynamoDbSchema } from '../lib/dynamoDbSchemas/customerDynamoDbSchema';
import { convertDynamoFieldsToClientFields } from '../lib/convertDynamoFieldsToClientFields';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function updateCustomer(event, context) {
  const { id } = event.pathParameters;
  let updatedCustomer = {};
  let body = event.body;
  let statusCode = 200;
  const headers = { 'Content-Type': 'application/json' };
  // todo: clean this up.
  const fieldsToReturn = {
    customerId: true,
    externalId: false,
    ssn: false,
    username: false,
    email: true,
    title: false,
    firstName: true,
    middleName: false,
    lastName: true,
    suffix: false,
    gender: false,
    dateOfBirth: false,
    addresses: false,
    phoneNumbers: false,
    createdAt: false,
    updatedAt: true,
  };
  // get the customer item - error handling compeleted by getCustomerById
  const customer = await getCustomerById(id, fieldsToReturn);
  // todo this is here to use customer before we implement the logic to only update fields that have changed.
  console.log(customer);

  const customerSchema = customerDynamoDbSchema.clientFieldsMap;

  // build the update expression from the json passed through the body
  const {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  } = await generateUpdateQuery(body, customerSchema);

  // build the params object
  const params = {
    TableName: process.env.CUSTOMERS_TABLE_NAME,
    Key: {
      PK: 'C#' + id,
      SK: 'C#' + id,
    },
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'UPDATED_NEW',
  };

  try {
    const result = await dynamodb.update(params).promise();
    // get the fields mapped to the client schema from the keys in the result set.
    const clientFields = await convertDynamoFieldsToClientFields(
      _.keys(result.Attributes),
      customerSchema
    );

    Object.entries(result.Attributes).forEach(([key, item]) => {
      let newKey = clientFields[key];
      updatedCustomer[newKey] = item;
    });

    // add the customerId field
    updatedCustomer['customerId'] = id;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  } finally {
    body = JSON.stringify(updatedCustomer);
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
