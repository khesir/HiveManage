CREATE DATABASE IF NOT EXISTS pcbeedb;

USE pcbeedb;

DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS additional_pay;
DROP TABLE IF EXISTS adjustments;
DROP TABLE IF EXISTS benefits;
DROP TABLE IF EXISTS deductions;
DROP TABLE IF EXISTS payroll_approval;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS signitory;
DROP TABLE IF EXISTS leave_limit;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS designation;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employement_information;
DROP TABLE IF EXISTS salary_information;
DROP TABLE IF EXISTS ActivityLogs;
DROP TABLE IF EXISTS identification_financial_information;
DROP TABLE IF EXISTS personal_information;
DROP TABLE IF EXISTS employee;

-- inventory
DROP TABLE IF EXISTS tag_items;
DROP TABLE IF EXISTS supplier;
DROP TABLE IF EXISTS item;


CREATE TABLE leave_request (
  leave_request_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  title varchar(255),
  content varchar(255),
  date_of_leave date,
  date_of_return date,
  status varchar(255),
  comment varchar(255),
  leaveType ENUM ('sick_leave', 'vacation_leave', 'personal_leave'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE signitory (
  signatory_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  signatory_name varchar(255),
  role varchar(255),
  permission_level int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE payroll (
  payroll_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  start date,
  end date,
  pay_date date,
  netpay float,
  grosspay float,
  total_deductions float,
  total_benefits float,
  approval_status ENUM ('approved', 'pending', 'rejected'),
  approval_date date,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE payroll_approval (
  payroll_approval_id bigint PRIMARY KEY  AUTO_INCREMENT,
  payroll_id bigint,
  signatory_id bigint,
  approval_status ENUM ('approved', 'pending', 'rejected'),
  approval_date date,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (payroll_id) REFERENCES payroll(payroll_id),
  FOREIGN KEY (signatory_id) REFERENCES signitory(signatory_id)
);

CREATE TABLE deductions (
  deduction_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  start date,
  end date,
  deduction_type varchar(255),
  amount float,
  description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE benefits (
  benefits_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  start date,
  end date,
  benefits_type varchar(255),
  amount float,
  description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE adjustments (
  adjustments_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  start date,
  end date,
  adjustments_type varchar(255),
  amount float,
  description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE additional_pay (
  additional_pay_id bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  start date,
  end date,
  additional_pay_type varchar(255),
  amount float,
  description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

CREATE TABLE attendance (
  attendance bigint PRIMARY KEY  AUTO_INCREMENT,
  employee_id bigint,
  date date,
  clock_in date,
  clock_out date,
  hoursWorked decimal,
  status ENUM ('present', 'absent', 'late', 'early_leave'),
  description varchar(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);

-- Creating Default data
INSERT INTO department (name, status)
VALUES ('Sales', 'active'),
       ('Technical', 'active');

INSERT INTO designation (title, status)
VALUES 
    ('Technician Head', 'active'),
    ('Technician', 'active'),
    ('Sales Head', 'active'),
    ('Sales', 'active');


CREATE TABLE item (
  item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  description VARCHAR(255),
  quantity INTEGER,
  type ENUM('device', 'parts'),
  item_condition ENUM('used', 'new', 'damage'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE supplier (
  supplier_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  contact_number VARCHAR(255),
  remarks VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tag_items (
  supplier_id BIGINT,
  item_id BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES supplier(supplier_id),
  FOREIGN KEY (item_id) REFERENCES item(item_id)
);

INSERT INTO supplier (name, contact_number, remarks, created_at, last_updated)
VALUES 
  ('Tech Supplies Co.', '123-456-7890', 'Primary tech supplier', NOW(), NOW()),
  ('Parts Unlimited', '098-765-4321', 'Provides various parts', NOW(), NOW());


INSERT INTO item (name, description, quantity, type, item_condition, created_at, last_updated)
VALUES 
  ('Laptop', '14-inch laptop with 16GB RAM', 10, 'device', 'new', NOW(), NOW()),
  ('Monitor', '24-inch monitor', 15, 'device', 'used', NOW(), NOW()),
  ('RAM Module', '8GB DDR4 RAM', 50, 'parts', 'new', NOW(), NOW());
INSERT INTO tag_items (supplier_id, item_id, created_at, last_updated)
VALUES 
  (1, 1, NOW(), NOW()),  -- Tech Supplies Co. supplies Laptop
  (1, 2, NOW(), NOW()),  -- Tech Supplies Co. supplies Monitor
  (2, 3, NOW(), NOW());  -- Parts Unlimited supplies RAM Module
