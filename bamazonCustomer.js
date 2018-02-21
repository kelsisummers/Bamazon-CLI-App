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
    // login();
  });



function artistSongs(){
  inquirer
  .prompt([
    {
        name: "artist",
        type: "input",
        message: "Which Artist's Songs?",
    }
  ]).then(function(input) {
    var artist = input.artist;
    connection.query("SELECT * FROM products WHERE artist=?", [ artist], function(err, res) {
      console.log("-----------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].artist + " | Song: " + res[i].song + " | Year: " + res[i].year + " | ");
      }
      console.log("-----------------------------------");
    connection.end();
    });
  });
}