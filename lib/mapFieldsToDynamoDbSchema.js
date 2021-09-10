export async function mapFieldsToDynamoDbSchema(
  fieldsToUpdate,
  dynamoDbClientSchema
) {
  let fields = {};
  // update the keys in the customerValuesToUpdate object to match the database schema
  Object.entries(fieldsToUpdate).forEach(([key, item]) => {
    // look up the dynamodb attribute name from the schema
    let newKey = dynamoDbClientSchema[key];
    // add the item to the fileds object with the dynamodb attribute name
    fields[newKey] = item;
  });

  return fields;
}
