const convict = require('convict');

export const config = convict({
  customersTableName: {
    doc: 'The customer table name',
    format: String,
    default: '',
    env: 'TABLE_NAME',
  },
}).validate({ allowed: 'strict' });
