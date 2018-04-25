var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",                  // name of DB server
    port: "3306",                       // unsecure port, 3307 uses SSL/is secure
    user: "root",                       // default is root
    password: "",   // your password
    database: "bamazon"            // need to create this in MySQL
})

displayItems();



function displayItems(){

    connection.connect(function(err, response) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log(res);
      })
      .then(function(answer) {
        // get the information of the chosen item
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i === answer.choice) {
            chosenItem = results[i];
          }
        }
    
    
    
    });
   
}



/*

var questions = [
    {
        message: "What is the ID of the item you would like to buy?",
        type: "input",
        name: "itemId",
        
      },{
        message: "How many would you like to buy?",
        type: "input",
        name: "units",
        
      }
    ]
    inquirer.prompt(questions, processAnswers);
*/