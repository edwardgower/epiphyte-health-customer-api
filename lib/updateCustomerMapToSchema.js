export async function updateCustomerMapToSchema(customerValuesToUpdate) {
  let fields = {};

  // create the schema map to dynamoDb attribute names
  const schema = {
    title: 'Name1',
    firstName: 'Name2',
    middleName: 'Name3',
    suffix: 'Name5',
    gender: 'Name6',
    dateOfBirth: 'Date1',
  };

  // update the keys in the customerValuesToUpdate object to match the database schema
  Object.entries(customerValuesToUpdate).forEach(([key, item]) => {
    // look up the dynamodb attribute name from the schema
    let newKey = schema[key];
    // add the item to the fileds object with the dynamodb attribute name
    fields[newKey] = item;
  });

  return fields;
}
