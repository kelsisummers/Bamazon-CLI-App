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
("Kitchen Aid", "Kitchen", 249.99, 5), ("Blanket", "Decor", 21.99, 24), 
("Coffee Table", "Decor", 199.99, 10), ("Scarf", "Apparel", 5.49, 100), 
("Potting Soil", "Garden", 3.50, 250);


SELECT * FROM products;

CREATE TABLE departments(   
department_id INT(2) zerofill KEY AUTO_INCREMENT,   
department_name VARCHAR(100) NOT NULL,   
over_head_costs INT NOT NULL,   
product_sales DECIMAL (10, 2) NULL
);

INSERT INTO departments (department_name, over_head_costs, product_sales) 
VALUES ("Electronics", 60000, 50000), ("Decor", 1000, 500), 
("Kitchen", 10000, 750), ("Apparel", 25000, 15000),
("Garden", 3000, 2500); 

SELECT * FROM departments;
