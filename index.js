//--import
const sql = require("mssql"),
  _ = require("lodash"),
  moment = require("moment"),
  db = require("./libs/database"),
  cpSumDate = require("./computeSummaryDate"),
  async = require("async"),
  UpdateDynamoDbTable = require("./updateSummaryDyamodb"),
  DeletMessage = require("./deleteMessage");
FetchBusinessMode = require("./fetchBusinessMode");
var sqs = require("./libs/awsmanager").sqs;


console.log("START : " + moment().format());
function main() {
  console.log("main function runs.....");
  var params = {
    QueueUrl:
      "https://sqs.ap-southeast-1.amazonaws.com/610982430783/niceloop-report-email-monthly",
    MaxNumberOfMessages: 10,

    VisibilityTimeout: 60
  };

  sqs.receiveMessage(params, function(err, data) {
    if (err) return console.log(err, err.stack); // an error occurred
    // successful response

    if (data.Messages == undefined || data.Messages.length == 0) {
      console.log("END : " + moment().format());
      throw "END : " + moment().format();
      return;
    }

    async.each(
      data.Messages,
      function(message, callbackOfOneMessage) {
        var data = JSON.parse(message.Body);
        var customerId = parseInt(data);
        var idMessageToDelete = message.ReceiptHandle;
        var businessMode = 0;
        var totalBills = 0;

        function getBills() {
          return totalBills;
        }

        function setBills(count) {
          return (totalBills = count);
        }

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
              }, setBills);
            },

            // // 300. update summary dynamodb
            function(results, cb) {
              new UpdateDynamoDbTable(customerId, results, cb);
            },

            // // 400 delete message
            function(cb) {
              new DeletMessage(idMessageToDelete, cb);
            }
          ],
          function(err) {
            if (err) {
              return console.log(err);
            }
            console.log(
              "complete customer id : " +
                customerId +
                ",  has bills : " +
                totalBills
            );
            callbackOfOneMessage();
          }
        );
      },
      function(err, data) {
        if (err) {
          return console.log(err);
        }

        setTimeout(function  (params) {
          main();
        }, 10 *1000)
        
      }
    );
  });
}

main();
