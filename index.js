//--import
const sql = require('mssql'),
    _ = require('lodash'),
    moment = require('moment'),
    db = require('./libs/database'),
    cpSumDate = require('./computeSummaryDate'),
    async = require('async')
    ;

function main() {

    async.waterfall([

        // // 100. fecth from sqs 
        // function (cb) {
        //     cb()
        // },


        // 200.  comdata fromsql
        function (cb) {

            var cpSD = new cpSumDate(2);
            cpSD.run(function (results) {
                cb(null, results)
            })
        }


        // // 300. update summary dynamodb
        // function (results, cb) {

        // },

        // // 400 delete message
        // function () {

        // },



    ], function () {

        //complete
        // cb(null, data)

        //run main again
        // main()
    })



}


main()





