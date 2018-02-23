//--import
const sql = require('mssql')
const _ = require('lodash')
const moment = require('moment')
const xl = require("excel4node");
const db = require('./libs/expense_online/database')
const sheetsummary = require("./libs/expense_online/excelSummary")
const sheetgroup = require("./libs/expense_online/excelGroup")
const sheetdetail = require("./libs/expense_online/excelDetail")
const async = require('async')
//--constant
var now = new Date()
var datetime2 = moment(now).format("DDMMYY_HHmmss");

var config = {
    apiKey: "AIzaSyAWPjlVGj3Hji9uGvCpVIEwS0RZ5EP15ew",
    authDomain: "dii-pos-3d8bf.firebaseapp.com",
    databaseURL: "https://dii-pos-3d8bf.firebaseio.com",
    projectId: "dii-pos-3d8bf",
    storageBucket: "dii-pos-3d8bf.appspot.com",
    messagingSenderId: "713978325012"
};

const keyFilename = __dirname + '/libs/key.json'; //replace this with api key file
const projectId = config.projectId  //replace with your project id
const bucketName = `${projectId}.appspot.com`;

const gcs = require('@google-cloud/storage')({
    projectId,
    keyFilename
});
const bucket = gcs.bucket(bucketName);

var generateExcel = function (request, callback) {

    var _callback = callback;

    var request = request || {
        from: '2017-01-01T15:00:00',
        to: '2017-01-31T15:00:00',
        shopname: 'Aroijung_LP101',
        customerId: '4073'
    }




    async.waterfall([

        // generate file
        function (cb) {

            var dbInstance = new db(request);
            dbInstance.run(function (data) {

                console.log("- build ExpenseReport Start...");
                var wb = new xl.Workbook();
                var filename = "Expenses_" + request.shopname + "_" + datetime2 + ".xlsx";
                // main();
                new sheetsummary.report(data, wb, request, "Summary");
                new sheetgroup.report(data, wb, request, "Group");
                new sheetdetail.report(data, wb, request, "Detail");
                wb.write(filename);
                console.log("- Genearate Complete : " + filename);


                setTimeout(function () {
                    cb(null, filename)

                }, 2000)

            })
        },

        // upload file
        function (pathTmpFile, cb) {

            var pathFile = __dirname + '/' + pathTmpFile;
            bucket.upload(pathFile, {
                destination: pathTmpFile,
                public: true,
                //  metadata: {contentType: fileMime,cacheControl: "public, max-age=300"}
            }, function (err, file) {
                if (err) {
                    console.log(err);
                    return;
                }

                cb(null, file.metadata.mediaLink)

                //  console.log(createPublicFileURL(uploadTo));
            });

        },

    ], //return url to download
        function (err, urlDownload) {
            //res.send(urlFile);
            if (err) {
                return err
            }
            console.log(urlDownload)
            if (callback) {
                callback()
            }
        })
}
generateExcel()
exports.generateExcel = generateExcel;
