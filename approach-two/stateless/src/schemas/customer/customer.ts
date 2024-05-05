export const schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Customer',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'The unique identifier for the customer',
    },
    created: {
      type: 'string',
      description: 'The created date of the customer',
    },
    name: {
      type: 'string',
      description: 'The name of the customer',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'The email address of the customer',
    },
    phone: {
      type: 'string',
      description: 'The phone number of the customer',
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          description: 'The street address',
        },
        city: {
          type: 'string',
          description: 'The city',
        },
        state: {
          type: 'string',
          description: 'The state or province',
        },
        zipcode: {
          type: 'string',
          description: 'The postal code',
        },
        country: {
          type: 'string',
          description: 'The country',
        },
      },
      required: ['street', 'city', 'state', 'zipcode', 'country'],
    },
    membership: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          description: 'The membership status of the customer',
        },
        since: {
          type: 'string',
          format: 'date',
          description: 'Date when the membership was initiated',
        },
      },
    },
  },
  required: ['id', 'created', 'name', 'email', 'address'],
};
