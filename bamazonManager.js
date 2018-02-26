var mysql = require("mysql");
var inquirer = require("inquirer");

// Array That Will Hold Items With Low Inventory
var stockNeeded = [];


// Cnnection Information For The MySQL Database
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
  // Calls First Function After Connection Is Established
  managing();
});

connection.query("SELECT * FROM products", function(err, res) {
  // Determines Items With Low Inventory, Pushes To Empty Array
  for (var i = 0; i < res.length; i++) {
    if(res[i].stock_quantity <= 5){
      stockNeeded.push(res[i].product_name);  
    };
  };
});

// First Function To Determine Manager Choice
function managing(){
  console.log("");
  inquirer.prompt([
    {
    message: "What would you like to do?",
    name: "action",
    type: "list",
    // List Of Available Manager Functions
    choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Go Home"]
    }
  ]).then(function(shopping){
    // First Option Is To End App
    if (shopping.action === "Go Home") {
      console.log("\n Bye, then!\n");
      connection.end();
    // OR View Products For Sale
    } else if (shopping.action === "View Products For Sale") {
      viewProducts();
    // OR View Low Inventory
    } else if (shopping.action === "View Low Inventory") {
      lowInventory();
    // OR Add More Inventory
    } else if (shopping.action === "Add To Inventory") {
      addInventory();
    // OR Add New Product
    } else if (shopping.action === "Add New Product") {
      addProduct();
    };
  });  
};

// Function To View All Products
function viewProducts(){
  // Query Made To Database
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("\n-----------------------------------");
    // All Products Are Listed
    for (var i = 0; i < res.length; i++) {
      console.log("Product_ID: " + res[i].item_id + " | Product_Name: " + res[i].product_name + " | Price: " + res[i].price.toFixed(2) + " | Quantity: " + res[i].stock_quantity + " | " );
    }
    console.log("\n-----------------------------------");
    // Prompted To Choose Another Function
    managing();
  });
};

// Function To View Low Inventory
function lowInventory(){
  // Query Made To Databse
  connection.query("SELECT * FROM products", function(err, res) {
    console.log("\n-----------------------------------\n");
    // Loops Through All Products
    for (var i = 0; i < res.length; i++) {
      // Checks Quanity. If Less Than Or Equal To 5, It's Displayed To Manager
      if(res[i].stock_quantity <= 5){
      console.log("Product_ID: " + res[i].item_id + " | Product_Name: " + res[i].product_name + " | Price: " + res[i].price.toFixed(2) + " | Quantity: " + res[i].stock_quantity + " | " );
      };
    };
    // If No Items Are Low On Inventory
    if (stockNeeded.length === 0){
      // Message Displayed To Manager
      console.log("Good news! Everything's stocked!");
    };
    console.log("\n-----------------------------------");
    // Prompts Manager To Choose Another Action
    managing();

  // Troubleshooting:
  // console.log("Array: ", stockNeeded)
  // console.log("Quantities: ",res[i].stock_quantity)
  // console.log("Array Length: ", stockNeeded.length);
  });
};

// Function To Add Inventory
function addInventory() {
  // Queries Database For All Products
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    
    console.log("-----------------------------------\n");
    inquirer.prompt([
      {
      message: "What item would you like to stock?",
      name: "choice",
      type: "list",
      // Loops Through All Products; Listed As Manager Choices
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
          choiceArray.push(results[i].product_name);          
        };
        return choiceArray;
        },
      },
    ]).then(function(answer) {
      // Saves Information Of Chosen Item
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === answer.choice) {
          chosenItem = results[i];
        };
      };
      // Asks The Manager To Declare Amount Of New Inventory
      inquirer.prompt([
        {
        name: "stock",
        type: "input",
        message: "Current Inventory: " + chosenItem.stock_quantity + " Units. How many would you like to add?"
        }
      ]).then(function(update){
      // Troubleshooing:
      // console.log("Chosen Item: ", chosenItem.stock_quantity);
      // console.log("New Inventory: ", newInventory);
      // console.log("Chosen Item", chosenItem);
      // console.log("Stock Array", stockNeeded)
        
        // New Inventory Calculated Using Manager Input
        var newInventory = chosenItem.stock_quantity += parseInt(update.stock);
        // Queries Database; Sets Stock Quantity To New Inventory
        connection.query("UPDATE products SET ? WHERE ?",[{stock_quantity: newInventory}, {item_id: chosenItem.item_id}], function(error) {
          // If There's An Error, Throw Error
          if (error) throw err;
          // Otherwise...
          console.log("-----------------------------------");
          console.log("\nInventory Stocked!");
          console.log("New Inventory Count: " + newInventory + "\n");
          console.log("-----------------------------------");

          // Loops Through Stock Needed Array And Removes Items With Increased Inventory
          for (var i = 0; i < stockNeeded.length; i++) {
            if (chosenItem.product_name === stockNeeded[i] && chosenItem.stock_quantity > 5) {
              stockNeeded.splice(i, 1);
            }; 
          };
        // Calls Manager Function
        managing();
        });
      });
    });
  });
};

// Function To Add New Product To Inventory
function addProduct(){
    // A Series Of Prompts Are Made To Manager
    inquirer.prompt([
        // Product Name
        {
            name: "product",
            type: "input",
            message: "Set Product Name"
        },
        // Product Department
        {
            name: "dept",
            type: "input",
            message: "Set Product Department"
        },
        // Product Price
        {
            name: "price",
            type: "input",
            message: "Set Product Price"
        },
        // Product Quantity
        {
            name: "quantity",
            type: "input",
            message: "Set Product Quantity"
        }
    ]).then(function(add){
        // Price Saved As Integer With Two Decimals
        var price = parseFloat(add.price).toFixed(2);
        // Quantity Saved As Integer
        var quantity = parseInt(add.quantity);

        // If The Quantity Is Low, Item Is Pushed To Low Inventory Array
        if (quantity <= 5){
            stockNeeded.push(add.product);
        };
        
        // Query Made To Database
        connection.query(
            // Inserts A New Row With The Manager's Input
            "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + add.product + "', '" + add.dept + "'," + price + "," + quantity + ")",

            // If It Was Successful Or Not...
            function(error) {
                if (error) throw error;
                console.log("-----------------------------------");
                console.log("\nProduct Successfully Added!\n");
                console.log("-----------------------------------");
                // Function To Choose New Action Called  
                managing();

            // Troubleshooting:
            // console.log("Array: ", stockNeeded)
            }
        );
    });
};