//--import
const sql = require("mssql"),
  _ = require("lodash"),
  moment = require("moment"),
  db = require("./libs/database"),
  cpSumDate = require("./computeSummaryDate"),
  async = require("async"),
  UpdateDynamoDbTable = require("./updateSummaryDyamodb"),
  DeletMessage = require('./deleteMessage')
  FetchBusinessMode = require("./fetchBusinessMode");
var sqs = require("./libs/awsmanager").sqs;

function main() {
  console.log("main function runs.....");
  var params = {
    QueueUrl:  "https://sqs.ap-southeast-1.amazonaws.com/610982430783/niceloop-report-email-monthly",
    MaxNumberOfMessages: 1,

    VisibilityTimeout: 30
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err)
      return console.log(err, err.stack); // an error occurred
     // successful response

    async.each(
      data.Messages,
      function(message, callbackOfOneMessage) {
        var data = JSON.parse(message.Body);
        var customerId = parseInt(data)
        var idMessageToDelete = message.ReceiptHandle;
        var businessMode = 0;
        async.waterfall(
          [
            // // 110.  get businessMode
            function(cb) {
              new FetchBusinessMode(customerId, function(mode) {
                businessMode = mode;
                cb(null, mode);
              });
            },

            // 200.  comdata fromsql
            function(mode, cb) {
              var cpSD = new cpSumDate(customerId, mode);
              cpSD.run(function(results) {
                cb(null, results);
              });
            },

            // // 300. update summary dynamodb
            function(results, cb) {
              new UpdateDynamoDbTable(customerId, results, cb);
            },

            // // 400 delete message
            function(cb) {
               
              new DeletMessage(idMessageToDelete, cb )
            }
          ],
          function(err) {
            if (err) {
              return console.log(err);
            }
            console.log("complete customer id : " + customerId);
            callbackOfOneMessage();
          }
        );
      },
      function(err, data) {
        if (err) {
          return console.log(err);
        }

        main();
      }
    );
  });
}

main();
