CREATE DATABASE IF NOT EXISTS waves_store;
USE waves_store;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(100)
);

CREATE TABLE products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price INT,
  stock INT,
  amazon VARCHAR(255),
  flipkart VARCHAR(255),
  whatsapp VARCHAR(255)
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO products (id, name, description, price, stock, amazon, flipkart, whatsapp)
VALUES
('lamp', 'Waves Brown Slatted Lamp', 'Warm Glow, Tripod Base, perfect for cozy decor', 1499, 10,
 'https://amzn.in/d/09tcR9Ig', 'https://dl.flipkart.com/s/w34HuUNNNN', 'https://wa.me/918319534537?text=I%20want%20lamp'),
('candle', 'Waves Luxury Oud Candle', 'Luxury soy wax candle with 30+ hours burn time', 399, 20,
 'https://amzn.in/d/0jcFjXnu', '', 'https://wa.me/918319534537?text=I%20want%20candle');
 use waves_store;
 select * from products;
 
 CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id VARCHAR(100) NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users
ADD COLUMN is_admin TINYINT(1) DEFAULT 0;
UPDATE users
SET is_admin = 1
WHERE username = 'harshita';
DROP TABLE IF EXISTS cart;
CREATE TABLE cart (

  id INT AUTO_INCREMENT PRIMARY KEY,

  user_id INT NOT NULL,

  product_id VARCHAR(255) NOT NULL,

  quantity INT DEFAULT 1,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
SELECT * FROM products;
SELECT * FROM users;
UPDATE users
SET is_admin = 1
WHERE username = 'utkarsh';
DESCRIBE products;
DROP TABLE IF EXISTS products;
CREATE TABLE products (

  id VARCHAR(255) PRIMARY KEY,

  name VARCHAR(255) NOT NULL,

  description TEXT,

  price DECIMAL(10,2) NOT NULL,

  stock INT DEFAULT 0,

  discount VARCHAR(255),

  category VARCHAR(255),

  img TEXT,

  amazon TEXT,

  flipkart TEXT,

  whatsapp TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
INSERT INTO products
(id, name, description, price, stock, discount, category, img, amazon, flipkart, whatsapp)

VALUES
(
'lamp',

'Waves Lamp',

'Luxury wooden lamp',

1499,

10,

'20% OFF',

'lamp',

'https://m.media-amazon.com/images/I/61poeqTEhKL._SL1500_.jpg',

'https://amazon.in',

'https://flipkart.com',

'https://wa.me/918319534537'
);
INSERT INTO products
(id, name, description, price, stock, discount, category, img, amazon, flipkart, whatsapp)

VALUES
(
'lamp',

'Waves Brown Slatted Lamp',

'Warm Glow, Tripod Base, Bedside Nightstand Light. Perfect for cozy evenings and stylish decor.',

1499,

10,

'20% OFF',

'lamp',

'https://m.media-amazon.com/images/I/61poeqTEhKL._SL1500_.jpg',

'https://amzn.in/d/09tcR9Ig',

'https://dl.flipkart.com/s/w34HuUNNNN',

'https://wa.me/918319534537?text=I%20want%20to%20buy%20Waves%20Brown%20Slatted%20Lamp'
);
INSERT INTO products
(id, name, description, price, stock, discount, category, img, amazon, flipkart, whatsapp)

VALUES
(
'candle',

'Waves Luxury Oud Candle',

'Premium soy wax candle, 150g, 30+ hours burn time. Comes in borosilicate glass container with bamboo lid and wooden wick.',

399,

20,

'15% OFF',

'candle',

'https://m.media-amazon.com/images/I/51Ml-V+Rd4L._SL1251_.jpg',

'https://amzn.in/d/0jcFjXnu',

'https://flipkart.com',

'https://wa.me/918319534537?text=I%20want%20to%20buy%20Waves%20Luxury%20Oud%20Candle'
);
INSERT INTO products
(id,name,description,price,stock,discount,category,img,amazon,flipkart,whatsapp)
VALUES
('lamp','Waves Brown Slatted Lamp','Warm Glow, Tripod Base, Bedside Nightstand Light. Perfect for cozy evenings and stylish decor.',1499,10,'63% off','lamp','https://m.media-amazon.com/images/I/61poeqTEhKL._SL1500_.jpg','https://amzn.in/d/09tcR9Ig','https://dl.flipkart.com/s/w34HuUNNNN','https://wa.me/918319534537?text=I%20want%20to%20buy%20Waves%20Brown%20Slatted%20Lamp'),

('candle','Waves Luxury Oud Candle','Premium soy wax candle, 150g, 30+ hours burn time. Comes in a borosilicate glass container with bamboo lid and wooden wick.',399,20,'60% off','candle','https://m.media-amazon.com/images/I/51Ml-V+Rd4L._SL1251_.jpg','https://amzn.in/d/0jcFjXnu','','https://wa.me/918319534537?text=I%20want%20to%20buy%20Waves%20Luxury%20Oud%20Candle');
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  customer_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(20),
  items JSON,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DESCRIBE cart;
SELECT * FROM cart;
UPDATE users
SET password = SHA2('101010', 256),
    is_admin = 1
WHERE username = 'utkarsh';

UPDATE users
SET password = SHA2('123456', 256),
    is_admin = 0
WHERE username = 'harshita';
DESCRIBE products;

ALTER TABLE products
ADD image2 TEXT,
ADD image3 TEXT,
ADD details LONGTEXT;
SELECT id, username, password, is_admin FROM users;
select * from users;
DELETE FROM users
WHERE id > 0;

INSERT INTO users (username, password, is_admin)
VALUES
('utkarsh', SHA2('101010', 256), 1),
('harshita', SHA2('123456', 256), 0);
show tables;
DESCRIBE cart;