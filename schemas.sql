DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100),
department_name VARCHAR(100),
cost DECIMAL,
stock_quantity INTEGER,
PRIMARY KEY(item_id)
)

select * from products;
