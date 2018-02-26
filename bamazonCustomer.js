var mysql = require("mysql");
var inquirer = require("inquirer");

// Connection Info For The MySQL Database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Username
    user: "root",
  
    // Password
    password: "G3T0UT@ONCE",
    database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  // After The Connection Is Made, Call First Customer Function
  shopping();
});

// Function To Give User Choice Of Shopping Or Leaving App
function shopping(){
  inquirer.prompt([
    {
      name: "action",
      type: "list",
      choices: ["Go Shopping", "Leave Shop"],
      message: "What can we do for you?"
    }
  ]).then(function(shopping){
    // If User Chooses To Shop
    if (shopping.action === "Go Shopping") {
      // All Products For Sale Are Logged To Console
      connection.query("SELECT * FROM products", function(err, res) {
        console.log("\n-----------------------------------");
        for (var i = 0; i < res.length; i++) {
          // But Only If Quantity Is Greater Than 0
          if(res[i].stock_quantity > 0){
          console.log("Product ID: " + res[i].item_id + " | Product Name: " + res[i].product_name + " | Price: " + res[i].price.toFixed(2) + " | ");
          };
        };
      });
    // Calls Function That Allows User To "Purchase Item"
    buyItem();

    // If User Chooses To Leave, Bye!
    } else {
      console.log("\n Bye, then!\n");
      connection.end();
    };
  });
};

// This Function Allows User To Make "Purchases"
function buyItem() {
  // Queries The Database For All Products
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    // The Results Are Used By Inquirer To List Items For Purcahse
    console.log("-----------------------------------\n");
    inquirer.prompt([
      {
      message: "What item would you like to purchase?",
      name: "choice",
      type: "list",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          // Item Only Added To Choices If There Is Enough In "Stock"
          if(results[i].stock_quantity > 0){
            choiceArray.push(results[i].product_name);
          };
        };
        return choiceArray;
        }, 
      },
      // Asks The User How Many Items They Would Like To Purchse
      {
      name: "quantity",
      type: "input",
      message: "How many would you like to buy?"
      }
    ]).then(function(answer) {
      // Saves The Chosen Product As A Variable
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === answer.choice) {
          chosenItem = results[i];
        };
      };
      // Troubleshooting:
      // console.log("Stock: ", chosenItem.stock_quantity);
      // console.log("Quantity: ", answer.quantity);
      // console.log("Item ID: ", chosenItem.product_name)

      // Logic To Determine Whether There Are Enough Items In "Stock"
      if (chosenItem.stock_quantity >= parseInt(answer.quantity)) {
        // Subtracts User Purchase From Inventory
        var newInventory = chosenItem.stock_quantity -= parseInt(answer.quantity);
        // Calculates Order Total
        var orderTotal = chosenItem.price * parseInt(answer.quantity);
          
        // Updates Database With New Inventory
        connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newInventory}, {item_id: chosenItem.item_id}], function(error) {
          // If Error, Throw Error. 
          if (error) throw err;
          // Otherwise...
          console.log("-----------------------------------");
          // User Gets Success Message
          console.log("\nOrder successfully placed!");
          // User Gets Total Order Cost
          console.log("Total: $" + orderTotal.toFixed(2));
          console.log("\n-----------------------------------");
          shopping();
          
          // TroubleShooting
          // console.log("New Inventory: " + newInventory + "\n");
          }
        );
      // If There's Not Enough Inventory...
      } else {
        console.log("-----------------------------------\n");
        // User Is Told To Try Again
        console.log("\n Sorry! Not enough inventory to fill that order. Try again.\n");
        // Function Called To Try Purchase again
        buyItem();
      };
    });
  });
};