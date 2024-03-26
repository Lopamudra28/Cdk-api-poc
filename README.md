# Welcome to your CDK TypeScript project

This is a POC for spinning up a REST API in AWS 2.0 via CDK and Lambda with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute the app. 
The created API can be found in AWS 2.0. It is called openSpec-api. It has CDKDemo->HelloLambda integrated. It is a very basic POC just to figure out development and deployment of Apigateway and Lambda using CDK

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
