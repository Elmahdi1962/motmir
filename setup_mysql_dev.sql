-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS motmir_db;
CREATE USER IF NOT EXISTS 'motmir_dev'@'localhost' IDENTIFIED BY 'motmir_pwd';
GRANT ALL PRIVILEGES ON `motmir_db`.* TO 'motmir_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'motmir_dev'@'localhost';
FLUSH PRIVILEGES;
