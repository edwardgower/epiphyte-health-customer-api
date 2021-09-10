import AWS from 'aws-sdk';
import createError from 'http-errors';
import { customerDynamoDbSchema } from '../lib/dynamoDbSchemas/customerDynamoDbSchema';
import { generateProjectionExpression } from '../lib/generateProjectionExpression';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getCustomerById(customerId, fieldsToReturn) {
  const customerSchema = customerDynamoDbSchema.clientFieldsMap;
  let customer;

  const { ProjectionExpression, ExpressionAttributeNames } =
    await generateProjectionExpression(fieldsToReturn, customerSchema);

  const params = {
    TableName: process.env.CUSTOMERS_TABLE_NAME,
    Key: {
      PK: 'C#' + customerId,
      SK: 'C#' + customerId,
    },
    ProjectionExpression,
    ExpressionAttributeNames,
  };

  try {
    const result = await dynamodb.get(params).promise();
    customer = result.Item;
  } catch (error) {
    console.log(error);
    throw new createError.NotFound(
      `Customer with ID: ${customerId} not found!`
    );
  }
  return customer;
}
