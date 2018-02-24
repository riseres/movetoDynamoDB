
 var sqs = require('./libs/awsmanager').sqs

function DeledMessage(messageId, cb){

    var params = {
        QueueUrl: 'https://sqs.ap-southeast-1.amazonaws.com/610982430783/niceloop-report-email-monthly', /* required */
        ReceiptHandle: messageId /* required */
      };
      sqs.deleteMessage(params, cb);
}


module.exports = DeledMessage