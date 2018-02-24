const receiptsService = require("./libs/database"),
  _ = require("lodash"),
  moment = require("moment");

var Compute = function(customerId, businessMode) {
  var customerId = customerId;
  var businessMode = businessMode;
  //fetch from DB SQL
  return {
    run: run
  };

  function run(cb) {
     var cp = new receiptsService(customerId, businessMode);
    cp.run(function(receipt) {
      var count = 0;

      //--start compute data
      var result = _.reduce(
        receipt,
        function(acc, value) {
          var date_shot = moment.utc(value.Date).format("YYYY-MM-DD");
          if (businessMode == 1) {
            date_shot = moment.utc(value.Date)
              .add(-7, "h")
              .format("YYYY-MM-DD");
          }

          if (acc[date_shot] == undefined) {
            acc[date_shot] = {
              customerId: value.CustomerId,
              date: date_shot,
              grandTotal: 0,
              bills: 0
            };
          }

          acc[date_shot].grandTotal += value.GrandTotal;
          acc[date_shot].bills++;

          count++;
          return acc;
        },
        {}
      );
 

      cb(result);
    });
  }
};

module.exports = Compute;
