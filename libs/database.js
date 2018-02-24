//--import
const sql = require('mssql')
const moment = require('moment')
var config = require('./config.db')
 
var StringBuilder = require("string-builder");

var aa = function (customerId, mode) {

    var customerId = customerId,
    mode =mode,
        data = [];



    return {
        run: run
    }


    function command() {
 
        var sb = new StringBuilder();


        var cmd = "";

        cmd += ' SELECT * FROM [FoodDbContext].[dbo].[Orders] ';
        cmd += " WHERE CustomerId = '" + customerId + "' ";
        cmd += " AND Date BETWEEN '2018-01-01 {0}' and '2018-02-28 {0}'"
        cmd += " AND IsDeleted = '0' "


        if(mode ==1 ){
            sb.appendFormat(cmd, '07:00:00')
        }else{
            sb.appendFormat(cmd, '00:00:00')
        }

        return sb.toString()

        // return "SELECT TOP (10) * FROM [FoodDbContext].[dbo].[Expenses] WHERE CustomerId = '" + customerId.customerId + "'AND DateTime BETWEEN '" + customerId.from + "' AND '" + customerId.to + "' ORDER BY Id "
    }


    function run(cb) {

        sql.connect(config, err => {
           
            const request = new sql.Request()
            request.stream = true // You can set streaming differently for each request 
            request.query(command()) // or request.execute(procedure) 

            request.on('recordset', columns => {
                // Emitted once for each recordset in a query
            })

            request.on('row', row => {
                // Emitted for each row in a recordset 

                data.push(row)

            })

            request.on('error', err => {
                // May be emitted multiple times 
                debugger
                sql.close()
            })

            request.on('done', result => {
                // Always emitted as the last one 

                sql.close()

               
                cb(data);
             })

        })

    }

}

module.exports = aa;
