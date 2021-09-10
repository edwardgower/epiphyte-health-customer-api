import _ from 'lodash';

export async function convertDynamoObjectToClientObject(
  // this is the object returned from the query in the dynamoDb schema
  dynamoObject,
  // this is the object that maps the client schema to the dynamoDb one
  mappingSchema
) {
  let clientObject = {};

  const invertedSchema = _.invert(mappingSchema);

  Object.entries(dynamoObject).forEach(([key, item]) => {
    let newKey = invertedSchema[key];
    clientObject[newKey] = item;
  });

  return clientObject;
}
