import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';
import { AnyPrincipal, Effect } from 'aws-cdk-lib/aws-iam';

export class CdkDemoStack extends cdk.Stack {
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    
    super(scope, id, props);
    
    const helloHandler = new Function(this, 'hello-lambda', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'app.handler',
      code: Code.fromAsset(join(__dirname,'../lambdas'))
    });

    /*const deleteHandler = new Function(this, 'delete-lambda', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'delete.handler',
      code: Code.fromAsset(join(__dirname,'../lambdas'))
    });*/
    


    // using rest-api
    /*const api = new apigateway.RestApi(this, 'hello-api',{
      description: 'Basic API'

    });

    const books = api.root.addResource('books');
    books.addMethod('GET', new LambdaIntegration(helloHandler));

    const book = books.addResource('{book_id}');
    book.addMethod('DELETE', new LambdaIntegration(deleteHandler));
    */

    //using opiApi api-gateway
    const apiResourcePolicy = new cdk.aws_iam.PolicyDocument({
      statements: [
        new cdk.aws_iam.PolicyStatement({
          actions: ['execute-api:Invoke'],
          principals: [new AnyPrincipal()],
          resources: ['execute-api:/*'],
        }),
        new cdk.aws_iam.PolicyStatement({
          effect: Effect.DENY,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: ['execute-api:/*'],
          conditions: {
            'StringNotEquals': {
              "aws:SourceVpc": "vpc-0a9b9ebe0dbb829f6"
            }
          }
        })
      ]
    })

    const apigate = new apigateway.SpecRestApi(this, 'hello-openSpec-api',{
      apiDefinition:apigateway.ApiDefinition.fromAsset(join(__dirname,'../openapi.yaml')),
      endpointTypes: [apigateway.EndpointType.PRIVATE],
      policy: apiResourcePolicy
      });

      helloHandler.addPermission("LambdaPermisson", {
        principal: new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com"),
        action: "lambda:InvokeFunction",
        sourceArn: apigate.arnForExecuteApi(),
      });
  }
}
