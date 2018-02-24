const sql = require('mssql'),
    db = require('./libs/database'),
    _ = require('lodash'),
    moment = require('moment')
    ;

var Compute = function (customerId) {

    var customerId = customerId
    //fetch from DB SQL
    return {
        run: run
    }

    function run(cb) {
        console.log("-- customerId: " + customerId)
        var cp = new db(customerId)
        cp.run(function (receipt) {

            var count = 0

            //--start compute data
            var result = _.reduce(receipt, function (acc, value) {

                var date_shot = moment(value.Date).format("YYYY-MM-DD")
                if (acc[date_shot] == undefined) {
                    acc[date_shot] = {
                        customerId: value.CustomerId,
                        date: moment(value.Date).format("YYYY-MM-DD"),
                        grandTotal: value.GrandTotal
                    }
                } else {
                    acc[date_shot].grandTotal += value.GrandTotal
                }
                count++
                return acc
            }, {})

            // //--sent result
            console.log("record_count: " + count)
            console.log(result)

            cb(result)
        })
    }

}


module.exports = Compute