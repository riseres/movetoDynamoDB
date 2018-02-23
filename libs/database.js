//--import
const sql = require('mssql')
const moment = require('moment')

const config = {
    user: 'webapi',
    password: 'Resengineer1!',
    server: 'n201704091930.cwcd2a7ocpex.ap-southeast-1.rds.amazonaws.com', // You can use 'localhost\\instance' to connect to named instance
    database: 'FoodDbContext',
    port: '1433'
}



var aa = function (_request) {

    var shopname = _request.shopName,
        from = moment(_request.from).format('YYYY-MM-DD HH:mm:ss'),
        to = moment(_request.to).format('YYYY-MM-DD HH:mm:ss'),
        customerId = _request.customerId,
        callbackHolder = function () { },
        data = [];



    return {
        run: run
    }


    function command(qr) {
        return "SELECT TOP (1000) * FROM [FoodDbContext].[dbo].[Expenses] WHERE CustomerId = '" + qr.customerId + "'AND DateTime BETWEEN '" + qr.from + "' AND '" + qr.to + "' ORDER BY Id "
    }


    function run(cb) {
        callbackHolder = cb;
        sql.connect(config, err => {
            console.log("connect datadase...")

            const request = new sql.Request()
            request.stream = true // You can set streaming differently for each request 
            request.query(command(_request)) // or request.execute(procedure) 

            request.on('recordset', columns => {
                // Emitted once for each recordset in a query 
            })

            request.on('row', row => {
                // Emitted for each row in a recordset 

                data.push(row)

            })

            request.on('error', err => {
                // May be emitted multiple times 
                 sql.close()
            })

            request.on('done', result => {
                // Always emitted as the last one 
                sql.close()

                console.log("--export data...")
                // console.log(data)
                callbackHolder(data);
                console.log("--export done.")
            })

        })

    }

}

module.exports = aa;
