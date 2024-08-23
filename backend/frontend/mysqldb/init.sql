CREATE DATABASE IF NOT EXISTS pcbeedb;

USE pcbeedb;

DROP TABLE IF EXISTS payroll_approval;
DROP TABLE IF EXISTS signatory;
DROP TABLE IF EXISTS leave_request;
DROP TABLE IF EXISTS additional_pay;
DROP TABLE IF EXISTS adjustments;
DROP TABLE IF EXISTS benefits;
DROP TABLE IF EXISTS deductions;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS designation;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS employee_data;

CREATE TABLE employee_data (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  firstname VARCHAR(255),
  middlename VARCHAR(255),
  lastname VARCHAR(255),
  gender ENUM('male', 'female', 'others'),
  birthday VARCHAR(255),
  hireDate DATE,
  phone VARCHAR(255),
  email VARCHAR(255),
  address_line VARCHAR(255),
  barangay VARCHAR(255),
  province VARCHAR(255),
  pag_ibig_id VARCHAR(255),
  sss_id VARCHAR(255),
  philhealth_id VARCHAR(255),
  bank_account_number VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employee (
  employee_id INT PRIMARY KEY AUTO_INCREMENT,
  department_id BIGINT,
  designation_id BIGINT,
  employee_data BIGINT,
  employee_type ENUM('regular', 'probationary', 'contractual', 'seasonal', 'temporary'),
  employee_status ENUM('active', 'onLeave', 'terminated', 'resigned', 'suspended', 'retired', 'inactive'),
  payroll_frequency ENUM('daily', 'weekly', 'biWeekly', 'semiMonthly', 'monthly'),
  leave_limit INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE department (
  department_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  department_name VARCHAR(255),
  status VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE designation (
  designation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  department_id BIGINT,
  status VARCHAR(255),
  base_salary FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE leave_request (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee BIGINT,
  title VARCHAR(255),
  content VARCHAR(255),
  date_of_leave DATE,
  date_of_return DATE,
  status VARCHAR(255),
  comment VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE signatory (
  signatory_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  signatory_name VARCHAR(255),
  role VARCHAR(255),
  permission_level INT
);

CREATE TABLE payroll_approval (
  payroll_approval_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  payroll_id BIGINT,
  signatory_id BIGINT,
  approval_status ENUM('approved', 'pending', 'rejected'),
  approval_date DATE,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE payroll (
  payroll_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  start DATE,
  end DATE,
  pay_date DATE,
  netpay FLOAT,
  grosspay FLOAT,
  total_deductions FLOAT,
  total_benefits FLOAT,
  approval_status ENUM('approved', 'pending', 'rejected'),
  approval_date DATE,
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE TABLE deductions (
  deduction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  start DATE,
  end DATE,
  deduction_type VARCHAR(255),
  amount FLOAT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE benefits (
  benefits_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  start DATE,
  end DATE,
  benefits_type VARCHAR(255),
  amount FLOAT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE adjustments (
  adjustments_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  start DATE,
  end DATE,
  adjustments_type VARCHAR(255),
  amount FLOAT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE additional_pay (
  additional_pay_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  employee_id BIGINT,
  start DATE,
  end DATE,
  additional_pay_type VARCHAR(255),
  amount FLOAT,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE employee ADD FOREIGN KEY (department_id) REFERENCES department (department_id);

ALTER TABLE employee ADD FOREIGN KEY (designation_id) REFERENCES designation (designation_id);

ALTER TABLE employee ADD FOREIGN KEY (employee_data) REFERENCES employee_data (id);

ALTER TABLE designation ADD FOREIGN KEY (department_id) REFERENCES department (department_id);

ALTER TABLE leave_request ADD FOREIGN KEY (employee) REFERENCES employee (employee_id);

ALTER TABLE signatory ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE payroll_approval ADD FOREIGN KEY (payroll_id) REFERENCES payroll (payroll_id);

ALTER TABLE payroll_approval ADD FOREIGN KEY (signatory_id) REFERENCES signatory (signatory_id);

ALTER TABLE payroll ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE deductions ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE benefits ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE adjustments ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);

ALTER TABLE additional_pay ADD FOREIGN KEY (employee_id) REFERENCES employee (employee_id);