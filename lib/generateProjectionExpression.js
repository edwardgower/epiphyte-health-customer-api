//   ProjectionExpression: '#ID1, #Name2, #Name4, #Created',
//   ExpressionAttributeNames: {
//     '#ID1': 'ID1',
//     '#Name2': 'Name2',
//     '#Name4': 'Name4',
//     '#Created': 'Created',
//   },
// };

import _ from 'lodash';

export async function generateProjectionExpression(
  // this is an object with boolean values set to true for the fileds we want to return
  fieldsToReturn,
  // this is the schema that maps the client fields to the dynamoDb fields
  dynamoDbClientSchema
) {
  let exp = {
    ProjectionExpression: '',
    ExpressionAttributeNames: {},
  };
  // select only the fields marked as true and return the client fields in an array
  const fieldsClientSchema = _.keys(_.pickBy(fieldsToReturn));
  // convert the client schema fileds to the dynamo schema and return them in an array
  const fieldsDynamoSchema = _.values(
    _.pick(dynamoDbClientSchema, fieldsClientSchema)
  );
  // build the expression
  fieldsDynamoSchema.forEach((element) => {
    exp.ProjectionExpression += `#${element}, `;
    exp.ExpressionAttributeNames[`#${element}`] = element;
  });
  exp.ProjectionExpression = exp.ProjectionExpression.slice(0, -2);

  return exp;
}
