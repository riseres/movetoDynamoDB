//--import
const sql = require('mssql')
const moment = require('moment')

const config = {
    user: 'webapi',
    password: 'Resengineer1!',
    server: 'summary-dynamodb-rewrite.cwcd2a7ocpex.ap-southeast-1.rds.amazonaws.com',
    database: 'FoodDbContext',
    port: '1433'
}



var aa = function (customerId, callback) {

    var customerId = customerId,
        data = [];



    return {
        run: run
    }


    function command() {


        var cmd = "";

        cmd += ' SELECT * FROM [FoodDbContext].[dbo].[Orders] ';
        cmd += " WHERE CustomerId = '" + customerId + "' ";
        cmd += " AND Date BETWEEN '2018-01-01 00:00:00' and '2018-01-30 23:59:00'"
        cmd += " AND IsDeleted = '0' "


        return cmd

        // return "SELECT TOP (10) * FROM [FoodDbContext].[dbo].[Expenses] WHERE CustomerId = '" + customerId.customerId + "'AND DateTime BETWEEN '" + customerId.from + "' AND '" + customerId.to + "' ORDER BY Id "
    }


    function run(cb) {

        sql.connect(config, err => {
            console.log("connect datadase...")

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

                console.log("--export data...")
                // console.log(data)
                cb(data);
                console.log("--export done.")
            })

        })

    }

}

module.exports = aa;
