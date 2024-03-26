import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { join } from 'path';

export class CdkDemoStack extends cdk.Stack {
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    
    super(scope, id, props);
    
    const helloHandler = new Function(this, 'hello-lambda', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'app.handler',
      code: Code.fromAsset(join(__dirname,'../lambdas'))
    });

    const deleteHandler = new Function(this, 'delete-lambda', {
      runtime: Runtime.NODEJS_16_X,
      memorySize: 512,
      handler: 'delete.handler',
      code: Code.fromAsset(join(__dirname,'../lambdas'))
    });
    


    // using rest-api
    const api = new apigateway.RestApi(this, 'hello-api',{
      description: 'Basic API'
    });

    const books = api.root.addResource('books');
    books.addMethod('GET', new LambdaIntegration(helloHandler));

    const book = books.addResource('{book_id}');
    book.addMethod('DELETE', new LambdaIntegration(deleteHandler));

    //using opiApi api-gateway
    const apigate = new apigateway.SpecRestApi(this, 'openSpec-api',{
      apiDefinition:apigateway.ApiDefinition.fromAsset(join(__dirname,'../openapi.yaml'))
      });

      helloHandler.addPermission("LambdaPermisson", {
        principal: new cdk.aws_iam.ServicePrincipal("apigateway.amazonaws.com"),
        action: "lambda:InvokeFunction",
        sourceArn: apigate.arnForExecuteApi(),
      });
  }
}
