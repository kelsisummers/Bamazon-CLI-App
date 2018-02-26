DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(   
item_id INT PRIMARY KEY AUTO_INCREMENT,   
product_name VARCHAR(100) NOT NULL,   
department_name VARCHAR(100) NOT NULL,   
price DECIMAL(10, 2) NOT NULL,   
stock_quantity INT NOT NULL
);

ALTER TABLE products AUTO_INCREMENT = 1001;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("HDTV", "Electronics", 139.99, 20), ("PS4", "Electronics", 299.99, 14), 
("Shower Curtain", "Decor", 9.99, 30), ("MP3 Player", "Electronics", 14.99, 10), 
("Area Rug","Decor", 249.99, 5), ("Book Shelf", "Decor", 49.99, 25), 
("Kitchen Aid", "Kitchen Supplies", 249.99, 5);


SELECT * FROM products;
