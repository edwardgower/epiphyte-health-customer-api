import { updateCustomerMapToSchema } from './updateCustomerMapToSchema';

export async function generateUpdateQuery(customerValuesToUpdate) {
  let exp = {
    UpdateExpression: 'set ',
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
  };

  const fields = await updateCustomerMapToSchema(customerValuesToUpdate);

  Object.entries(fields).forEach(([key, item]) => {
    exp.UpdateExpression += `#${key} = :${key}, `;
    exp.ExpressionAttributeNames[`#${key}`] = key;
    exp.ExpressionAttributeValues[`:${key}`] = item;
  });
  // trim off the last , in the update exporession.
  exp.UpdateExpression = exp.UpdateExpression.slice(0, -2);

  return exp;
}
