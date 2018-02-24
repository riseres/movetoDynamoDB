
var config = require('./libs/config.db')
const sql = require('mssql')


function FetchBusinassMode(customerId, cb){
 
    var cmd = 'SELECT * FROM [FoodDbContext].[dbo].[SystemEnvironments] '
    cmd += " WHERE CustomerId = '" + customerId +  "' ";
    cmd += " AND Name =  'BusinessMode' ";

var data = []
    sql.connect(config, err => {
        
        const request = new sql.Request()
        request.stream = true // You can set streaming differently for each request 
        request.query(cmd) // or request.execute(procedure) 

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

           
            if(data.length == 0){
               return  cb(0);
            }
             
            if(data[0]){
                return  cb(data[0].Value);
             }
             
        })

    })


}


module.exports = FetchBusinassMode