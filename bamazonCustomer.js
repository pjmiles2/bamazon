var mysql = require("mysql");
var inquirer = require("inquirer");

var qtyAvailable;
var qtyRequested;
var id;

var connection = mysql.createConnection({
    host: "localhost",                  
    port: "3306",                      
    user: "root",                       
    password: "",  
    database: "bamazon"            
})

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
});

displayItems();


function displayItems(){

    connection.connect(function(err, response) {
        connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement
            console.log("Products Available");
            console.log("---------------------------------------------")
      for (var i = 0; i < res.length; i++) {
        console.log(
          res[i].item_id + ": " + res[i].department_name + " | " + res[i].product_name +  " $" + res[i].cost);
      }
      console.log("-------------------------------------------------");
      inquirer
      .prompt([
        {
          type: "input",
          message: "What is the ID of the item you would like to purchase?",
          name: "id",
          validate: function(itemID) {
            //checks if id entered exists.
            if ((/^\d+$/.test(itemID) === false) || (itemID >= res.length) || (itemID === '0')) {
              console.log("\nEnter a valid ID number from the list above.");
            } else {
              return true;
            }
          }
        },
        {
          type: "input",
          message: "How many would you like?",
          name: "quantity",
          validate: function(quantity) {
            // This makes sure the user inputs a number
            if ((/^\d+$/.test(quantity) === false) || (quantity === '0')) {
              console.log("\nEnter a valid whole number.");

            } else {
              return true;
            }
          }
        }
      ])
      .then(function(answer) {
        connection.query(
          "SELECT stock_quantity FROM products WHERE ? ",
          {
            item_id: answer.id
          },
          function(err, res) {
            if (err) throw err;
            qtyAvailable = (res[0].stock_quantity);
            qtyRequested = parseInt(answer.quantity);
            id = answer.id;
            if (qtyRequested < qtyAvailable) {
              if(qtyRequested > 1){
              console.log(qtyRequested + " have been purchased");
              } else {console.log(qtyRequested + " has been purchased");}
              
              connection.query(
                "SELECT cost FROM products WHERE ? ",
                {
                  item_id: id
                },
                function(err, res) {
                  if (err) throw err;
                  var total = res[0].cost * qtyRequested;
                  console.log("Your total is: $" + total);
                }
              );  

              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: (qtyAvailable - qtyRequested)
                  },
                  {
                    item_id: id
                  }
                ],
                function(err, results) {
                  if (err) throw err;
                }
              );
                    
            } else {
              console.log("We do not have enough of that item in stock.");
            }
            //delays the start over function so that it doesnt run before the total
           setTimeout(() => {
            startOver();
           }, 10); 
          }
        );
       });
      });
  });


  
  // This prompts the user to see if they would like to see the list of products again.  It ends the connection if they say no.
  function startOver() {
    console.log("-------------------------------------------------");
    
    inquirer
      .prompt([
        {
          type: "list",
          message: "Would you like to make another purchase?",
          name: "menu",
          choices: ["yes", "no"]
        }
      ])
      .then(function(answer) {
        if (answer.menu === "yes") {
          displayItems();
        } else {
          console.log("Goodbye. Thank you for shopping here!")
          connection.end();
        }
      });
    }
  };
