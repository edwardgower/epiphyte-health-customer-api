import _ from 'lodash';
// returns an object with the dynamo field name as the key and the client field name as the value
export async function convertDynamoFieldsToClientFields(
  // this is an array of strings containing the dynamo field names
  dynamoFieldsToConvert,
  // this is the const object that defines the schema mapping between dynamo and the client
  dynamoDbClientSchema
) {
  let fields = {};

  // invert the dynamo schema so the client filed names are switched to from the key to the value
  dynamoDbClientSchema = _.invert(dynamoDbClientSchema);
  // we want to return the inverted schema for jsut the fileds the client wants as passed in the fields to return array
  fields = _.pick(dynamoDbClientSchema, dynamoFieldsToConvert);

  return fields;
}
