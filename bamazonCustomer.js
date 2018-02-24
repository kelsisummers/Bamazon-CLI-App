var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "G3T0UT",
    database: "bamazon_DB"
  });

  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    productList();
  });



function productList(){

    connection.query("SELECT * FROM products", function(err, res) {
      console.log("-----------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log("Product ID: " + res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price + " | ");
        promptCustomer(res[i].product_name);
      }
      console.log("-----------------------------------");
    connection.end();
    });
};

function promptCustomer(products){
  inquirer
  .prompt([
    {
    name: "choice",
    type: "list",
    message: "What would you like to purchase?",
    choices: products,
    },

  ]).then(function(choice) {
    inquirer.prompt ([
      {
      name: "units",
      type: "input",
      message: "How many " + choice + " would you like to purchase?",
      },
    ]).then(function(something){
      console.log("landed.")
    })
  });
}