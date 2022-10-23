export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "artifactstore7ba561af": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "api": {
        "uploadFileandMetadata": {
            "GraphQLAPIKeyOutput": "string",
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        },
        "searchKendra": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "searchNeptune": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    },
    "storage": {
        "storageArtifacts": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "function": {
        "artifactStoreSearchKendra": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "artifactStoreSearchNeptune": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    }
}