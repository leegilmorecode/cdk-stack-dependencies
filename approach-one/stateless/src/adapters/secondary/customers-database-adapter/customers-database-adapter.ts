import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

import { Customer } from '@dto/customer';
import { config } from '@config';
import { logger } from '@shared';
import { marshall } from '@aws-sdk/util-dynamodb';

const dynamoDb = new DynamoDBClient({});
const tableName = config.get('customersTableName');

export async function createCustomer(customer: Customer): Promise<Customer> {
  const params = {
    TableName: tableName,
    Item: marshall({ ...customer }),
  };

  try {
    await dynamoDb.send(new PutItemCommand(params));

    logger.info(`customer created with ${customer.id} into ${tableName}`);

    return customer;
  } catch (error) {
    console.error('error creating customer: ', error);
    throw error;
  }
}
