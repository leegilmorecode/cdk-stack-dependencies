import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodeLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as path from 'path';

import { Construct } from 'constructs';

export class ApproachTwoStatelessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lambdaPowerToolsConfig = {
      LOG_LEVEL: 'DEBUG',
      POWERTOOLS_LOGGER_LOG_EVENT: 'true',
      POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
      POWERTOOLS_TRACE_ENABLED: 'enabled',
      POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'captureHTTPsRequests',
      POWERTOOLS_SERVICE_NAME: 'customer-domain-service',
      POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'captureResult',
      POWERTOOLS_METRICS_NAMESPACE: 'CustomerNamespace',
    };

    // create the lambda function which creates new customers
    const createCustomerLambda: nodeLambda.NodejsFunction =
      new nodeLambda.NodejsFunction(this, 'CreateCustomerLambda', {
        functionName: 'create-customer-lambda',
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: path.join(
          __dirname,
          'src/adapters/primary/create-customer/create-customer.adapter.ts'
        ),
        memorySize: 1024,
        handler: 'handler',
        tracing: lambda.Tracing.ACTIVE,
        bundling: {
          minify: true,
        },
        environment: {
          ...lambdaPowerToolsConfig,
          TABLE_NAME: 'customer-table',
        },
      });

    // allow the lambda function to write to the table
    const table = dynamodb.Table.fromTableName(this, 'Table', 'customer-table');
    table.grantWriteData(createCustomerLambda);

    // we create our customers api
    const api: apigw.RestApi = new apigw.RestApi(this, 'Api', {
      description: 'Customers API',
      deploy: true,
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigw.MethodLoggingLevel.INFO,
      },
    });

    // create our resources on the api for 'customers'
    const root: apigw.Resource = api.root.addResource('v1');
    const customers: apigw.Resource = root.addResource('customers');

    // add a post endpoint so we can create customers
    customers.addMethod(
      'POST',
      new apigw.LambdaIntegration(createCustomerLambda, {
        proxy: true,
      })
    );
  }
}
