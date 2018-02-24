
 var documentClient = require('./libs/awsmanager').documentClient
var async = require('async')


function Update (customerId, objResult, cb){

    async.eachOfLimit(  objResult, 5, function(  value, key, cb){

        var params = {
            TableName: 'OrderSummary',
            Key: { 
                customerId : value. customerId.toString(),
                time : value.date
             },
            UpdateExpression: 'set grandTotal = :grandTotal,  #bill = :bill',
            ExpressionAttributeNames: {'#bill' : 'bill'},
            ExpressionAttributeValues: {
              ':grandTotal' : value.grandTotal,
              ':bill': value.bills
            }
          };
          
         
          
          documentClient.update(params, function(err, data) {
             if (err)  {
                 return cb(err) 
                 
            }
             
            cb()


          });


    } , cb )

}


module.exports = Update