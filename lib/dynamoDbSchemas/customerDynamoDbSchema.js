const customerDynamoDbSchema = {
  internalFields: {
    indexes: {
      PK: {
        name: 'ID1',
        type: 'UUID',
        prefix: 'C#',
        description: 'customerId',
      },
      SK: {
        name: 'ID1',
        type: 'UUID',
        prefix: 'C#',
        description: 'customerId',
      },
      GSI1PK: {
        name: 'ID2',
        type: 'string',
        prefix: 'EID#',
        description: 'externalId',
      },
      GSI1SK: {
        name: 'ID2',
        type: 'string',
        prefix: 'EID#',
        description: 'externalId',
      },
      GSI2PK: {
        name: 'ID5',
        type: 'string',
        prefix: 'EM#',
        description: 'email',
      },
      GSI2SK: {
        name: 'ID5',
        type: 'string',
        prefix: 'EM#',
        description: 'email',
      },
      GSI3PK: {
        name: 'LN#',
        type: 'fixed',
        value: 'LN#',
        description: 'lastName partion key fixed to LN#',
      },
      GSI3SK: {
        name: 'Name4',
        type: 'string',
        prefix: 'LN#',
        description: 'lastName',
      },
      GSI4PK: {
        name: 'ID3',
        type: 'string',
        prefix: 'SN#',
        description: 'Social Security Number',
      },
      GSI4SK: {
        name: 'ID3',
        type: 'string',
        prefix: 'SN#',
        description: 'Social Security Number',
      },
      GSI5PK: {
        name: 'ID4',
        type: 'string',
        prefix: 'UN#',
        description: 'userName',
      },
      GSI5SK: {
        name: 'ID4',
        type: 'string',
        prefix: 'UN#',
        description: 'userName',
      },
    },
    other: {
      Type: 'Customer',
      State: 'status',
      Created: 'createdAt',
      Updated: 'updatedAt',
    },
  },
  keyFields: {
    // key fields are unique and need a transaction to update them as they must be unique.
    customerId: 'ID1',
    externalId: 'ID2',
    ssn: 'ID3',
    username: 'ID4',
    email: 'ID5',
  },
  clientFieldsMap: {
    customerId: 'ID1',
    externalId: 'ID2',
    ssn: 'ID3',
    username: 'ID4',
    email: 'ID5',
    title: 'Name1',
    firstName: 'Name2',
    middleName: 'Name3',
    lastName: 'Name4',
    suffix: 'Name5',
    gender: 'Name6',
    dateOfBirth: 'Date1',
    addresses: 'Map1',
    phoneNumbers: 'Map2',
    updatedAt: 'Updated',
  },
};

export { customerDynamoDbSchema };
