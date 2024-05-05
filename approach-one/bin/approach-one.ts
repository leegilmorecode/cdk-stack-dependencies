#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { ApproachOneStatefulStack } from '../stateful/stateful';
import { ApproachOneStatelessStack } from '../stateless/stateless';

const app = new cdk.App();

const statefulStack = new ApproachOneStatefulStack(
  app,
  'ApproachOneStatefulStack',
  {}
);

// we pass the table reference into the stateless stack
new ApproachOneStatelessStack(app, 'ApproachOneStatelessStack', {
  table: statefulStack.table, // <-- reference is here
});
