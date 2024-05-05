import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateCustomer, Customer } from '@dto/customer';
import { MetricUnit, Metrics } from '@aws-lambda-powertools/metrics';
import { errorHandler, logger, schemaValidator } from '@shared';

import { Tracer } from '@aws-lambda-powertools/tracer';
import { ValidationError } from '@errors/validation-error';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import { createCustomerUseCase } from '@use-cases/create-customer';
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import middy from '@middy/core';
import { schema } from './create-customer.schema';

const tracer = new Tracer();
const metrics = new Metrics();

export const createCustomerAdapter = async ({
  body,
}: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (!body) throw new ValidationError('no payload body');

    const customer = JSON.parse(body) as CreateCustomer;

    schemaValidator(schema, customer);

    const created: Customer = await createCustomerUseCase(customer);

    metrics.addMetric('SuccessfulCreateCustomer', MetricUnit.Count, 1);

    return {
      statusCode: 201,
      body: JSON.stringify(created),
    };
  } catch (error) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) errorMessage = error.message;
    logger.error(errorMessage);

    metrics.addMetric('CreateCustomerError', MetricUnit.Count, 1);

    return errorHandler(error);
  }
};

export const handler = middy(createCustomerAdapter)
  .use(injectLambdaContext(logger))
  .use(captureLambdaHandler(tracer))
  .use(logMetrics(metrics));
