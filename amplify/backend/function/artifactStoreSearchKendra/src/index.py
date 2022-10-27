import json
import boto3
import pprint

kendra = boto3.client("kendra")

def handler(event, context):
  print("Received event: " + json.dumps(event, indent=2))
  query = event["queryStringParameters"]["query"]
  print("Nitin Query is "+query)
  response = search_kendra(query)

  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(response)
  }

def search_kendra(query):
    # Provide the index ID
    index_id = "297e2f07-5a3c-4a6f-a127-47abb46cac36"

    result = kendra.query(
            QueryText = query,
            IndexId = index_id)
#     response = {
#         "statusCode": 200,
#         "body": json.dumps(result),
#         "isBase64Encoded": "false"
#     }

    return result