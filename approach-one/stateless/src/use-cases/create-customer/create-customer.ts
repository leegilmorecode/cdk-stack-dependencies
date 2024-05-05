import { CreateCustomer, Customer } from '@dto/customer';
import { getISOString, logger, schemaValidator } from '@shared';

import { createCustomer } from '@adapters/secondary/customers-database-adapter';
import { schema } from '@schemas/customer';
import { v4 as uuid } from 'uuid';

export async function createCustomerUseCase(
  customer: CreateCustomer
): Promise<Customer> {
  const createdDate = getISOString();

  // create our customer
  const newCustomer: Customer = {
    id: uuid(),
    created: createdDate,
    ...customer,
  };

  // validate with a schema
  schemaValidator(schema, newCustomer);

  // write the record to the database
  await createCustomer(newCustomer);

  logger.info(`customer created event published`);

  return newCustomer;
}
