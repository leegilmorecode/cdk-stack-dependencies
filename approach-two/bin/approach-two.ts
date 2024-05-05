#!/usr/bin/env node

import 'source-map-support/register';

import * as cdk from 'aws-cdk-lib';

import { ApproachTwoStatefulStack } from '../stateful/stateful';
import { ApproachTwoStatelessStack } from '../stateless/stateless';

const app = new cdk.App();

// there are no references between our stacks
const statefulStack = new ApproachTwoStatefulStack(
  app,
  'ApproachTwoStatefulStack',
  {}
);

const statelessStack = new ApproachTwoStatelessStack(
  app,
  'ApproachTwoStatelessStack',
  {}
);

// we add the dependency on stacks here to guarantee ordering
statelessStack.addDependency(statefulStack);
