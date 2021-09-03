import AWS from 'aws-sdk';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getCustomerById(customerId) {
  let customer;

  const params = {
    Key: {
      PK: 'C#' + customerId,
      SK: 'C#' + customerId,
    },
    TableName: process.env.CUSTOMERS_TABLE_NAME,
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
