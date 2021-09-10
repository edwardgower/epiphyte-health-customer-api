import { mapFieldsToDynamoDbSchema } from './mapFieldsToDynamoDbSchema';

export async function generateUpdateQuery(
  fieldsToUpdate,
  dynamoDbClientSchema
) {
  let exp = {
    UpdateExpression: 'set ',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  let fields = await mapFieldsToDynamoDbSchema(
    fieldsToUpdate,
    dynamoDbClientSchema
  );

  // add the Updated time
  const timeNow = new Date();
  fields['Updated'] = timeNow.toISOString();

  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += `#${key} = :${key}, `;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  // trim off the last , in the update exporession.
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -2);

  return exp;
}
