var AWS = require('aws-sdk')

module.exports = {
       
    ses : new AWS.SES({
        region: 'us-west-2',

        accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
        secretAccessKey: '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'

    }),

    sqs: new AWS.SQS({
        apiVersion: '2012-11-05',
        region: 'ap-southeast-1',
        accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
        secretAccessKey: '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',
        endpoint: 'sqs.ap-southeast-1.amazonaws.com',
        signatureVersion :'v4'
    }),
    

    dynamoDb : new AWS.DynamoDB({
        region: 'ap-southeast-1',
        endpoint: 'dynamodb.ap-southeast-1.amazonaws.com',
        accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
        secretAccessKey: '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'

    }),

    documentClient :new AWS.DynamoDB.DocumentClient({
        region: 'ap-southeast-1',
        endpoint: 'dynamodb.ap-southeast-1.amazonaws.com',
        accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
        secretAccessKey: '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'

    }) ,


    lambda : new AWS.Lambda({
     //   apiVersion: '2014-11-13',
        endpoint: 'lambda.us-west-2.amazonaws.com',
        accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
        secretAccessKey: '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',

        region: 'us-west-2'
    }),
    
     cloudwatchlogs : new AWS.CloudWatchLogs({
         apiVersion: '2014-03-28',
         region: 'ap-southeast-1',
         
         accessKeyId: 'AKIAJQ7NATAV4G5Q3IHQ',
         secretAccessKey: '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'
     })

}