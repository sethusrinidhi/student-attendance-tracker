-- ========================================================================
-- AttendFlow MySQL Database Schema & Initial Data Migration
-- Optimized for High Throughput, Index Coverage, and Relational Integrity
-- ========================================================================

CREATE DATABASE IF NOT EXISTS attendancedb 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE attendancedb;

-- Disable foreign key checks during setup/migration
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------
-- Table: users (Stores authentication accounts with BCrypt passwords & roles)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------
-- Table: students (Roster of registered students with unique roll numbers)
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(30) NOT NULL,
    email VARCHAR(100) NULL,
    phone VARCHAR(20) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_students_roll UNIQUE (roll_number),
    INDEX idx_student_name (name),
    INDEX idx_student_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------
-- Table: attendance_records (Daily attendance records per student)
-- Index coverage designed for instant date-range scans & turnout aggregations
-- ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL,
    remarks VARCHAR(255) NULL,
    marked_by VARCHAR(50) NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_date UNIQUE (student_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_attendance_date_status (attendance_date, status),
    INDEX idx_attendance_student_id (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------
-- Migrate Users (with existing credentials preserved)
-- ------------------------------------------------------------------------
INSERT INTO users (id, created_at, email, full_name, password, role, username) VALUES
(1, '2026-10-26 19:34:18', 'trainer@academy.edu', 'Prof. Sarah Jenkins', '$2a$10$usZcV9OqeuPeobPI6MgraOdRbDhyQ8g.3guteYD169iQe27UUJfBa', 'ROLE_TRAINER', 'trainer'),
(2, '2026-10-26 19:34:18', 'admin@academy.edu', 'Campus Administrator', '$2a$10$pJz4SChDAzsMt1lgjAMTreOIWn33dFEEOiXwFGU7AzP4WKYODFAh6', 'ROLE_ADMIN', 'admin'),
(3, '2026-10-26 19:34:19', 'aarav@academy.edu', 'Aarav Sharma', '$2a$10$ptU8wXdd4FQIZAEvCnoRNO0nTNo7n4pIJ6L.BSpua6qoIIpHO8ipy', 'ROLE_STUDENT', 'student'),
(4, '2026-10-26 19:38:34', 'david@academy.edu', 'Prof. David Miller', '$2a$10$n7GgZaDNmh5X7F8UrX3rQOxjNC4Sz771xeUxo5.fmMq02zD1TM.se', 'ROLE_TRAINER', 'trainer_david'),
(33, '2026-10-26 19:57:09', 'test@example.com', 'Test User', '$2a$10$fyaPX8xJXDcAunHJ2d7HceuN08fycmgaoWYriwifg/YwM9QQUkcta', 'ROLE_TRAINER', 'testuser'),
(34, '2026-10-26 20:02:57', 'newuser123@example.com', 'New User', '$2a$10$prN4F7W/HX9Xsiz1H2Uzz.fDpGJhtqT/a3CntAryA6H4PhGatuGcK', 'ROLE_TRAINER', 'newuser123'),
(35, '2026-10-26 20:03:36', 'john@student.edu', 'John Doe', '$2a$10$Ymrqeim9YBKB6/70nQXoie6DUp/caR.qK8NvHi5btRq5DFL00ClSu', 'ROLE_STUDENT', 'student_john'),
(65, '2026-10-26 20:12:25', 'alice@wonderland.edu', 'Alice Wonderland', '$2a$10$ONhLid38ehNbNtSINE1TluNjQruzPiqpx4zA0ArEydCIcuMMs2KaO', 'ROLE_STUDENT', 'student_alice'),
(66, '2026-10-26 20:16:25', 'sun@academy.edu', 'sunny', '$2a$10$z3pvV8tQq8r2RRLATwHJ4eRPIMfcq1uAY/NuVLQfom.v45.gAF7S.', 'ROLE_TRAINER', 'sunny')
ON DUPLICATE KEY UPDATE 
    full_name = VALUES(full_name),
    email = VALUES(email),
    role = VALUES(role);

-- ------------------------------------------------------------------------
-- Migrate Students (including existing student roster)
-- ------------------------------------------------------------------------
INSERT INTO students (id, created_at, email, name, phone, roll_number) VALUES
(1, '2026-10-26 19:34:19', 'aarav@academy.edu', 'Aarav Sharma', '+1 (555) 101-2001', 'CS-2026-001'),
(2, '2026-10-26 19:34:19', 'diya@academy.edu', 'Diya Patel', '+1 (555) 101-2002', 'CS-2026-002'),
(3, '2026-10-26 19:34:19', 'rohan@academy.edu', 'Rohan Verma', '+1 (555) 101-2003', 'CS-2026-003'),
(4, '2026-10-26 19:34:19', 'ananya@academy.edu', 'Ananya Iyer', '+1 (555) 101-2004', 'CS-2026-004'),
(5, '2026-10-26 19:34:19', 'karthik@academy.edu', 'Karthik Nair', '+1 (555) 101-2005', 'CS-2026-005'),
(6, '2026-10-26 19:34:19', 'priya@academy.edu', 'Priya Reddy', '+1 (555) 101-2006', 'CS-2026-006'),
(7, '2026-10-26 19:34:19', 'vikram@academy.edu', 'Vikram Singh', '+1 (555) 101-2007', 'CS-2026-007'),
(8, '2026-10-26 19:34:19', 'sneha@academy.edu', 'Sneha Kulkarni', '+1 (555) 101-2008', 'CS-2026-008'),
(9, '2026-10-26 19:34:19', 'zaid@academy.edu', 'Mohammed Zaid', '+1 (555) 101-2009', 'CS-2026-009'),
(10, '2026-10-26 19:34:19', 'meera@academy.edu', 'Meera Nambiar', '+1 (555) 101-2010', 'CS-2026-010'),
(11, '2026-10-26 19:36:51', 'zara@academy.edu', 'Zara Khan', '+1 555-9988', 'CS-2026-011'),
(33, '2026-10-26 20:12:25', 'alice@wonderland.edu', 'Alice Wonderland', '+1 (555) 000-0000', 'CS-2026-999')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    email = VALUES(email),
    phone = VALUES(phone);

-- ------------------------------------------------------------------------
-- Migrate Attendance Records (Date-wise attendance history)
-- ------------------------------------------------------------------------
INSERT INTO attendance_records (id, attendance_date, marked_by, remarks, status, updated_at, student_id) VALUES
(1, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 1),
(2, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 2),
(3, '2026-10-26', 'trainer', 'Informed via email - unwell', 'ABSENT', '2026-10-26 19:34:19', 3),
(4, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 4),
(5, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 5),
(6, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 6),
(7, '2026-10-26', 'trainer', 'Informed via email - unwell', 'ABSENT', '2026-10-26 19:34:19', 7),
(8, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 8),
(9, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:52:36', 9),
(10, '2026-10-26', 'trainer', 'On time', 'PRESENT', '2026-10-26 19:34:19', 10),
(11, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 1),
(12, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 2),
(13, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 3),
(14, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 4),
(15, '2026-10-25', 'trainer', 'Medical leave', 'ABSENT', '2026-10-26 19:34:19', 5),
(16, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 6),
(17, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 7),
(18, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 8),
(19, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 9),
(20, '2026-10-25', 'trainer', 'Present', 'PRESENT', '2026-10-26 19:34:19', 10),
(21, '2026-10-26', 'trainer', 'Great punctuality', 'PRESENT', '2026-10-26 19:36:51', 11),
(22, '2026-10-27', 'trainer', 'Batch marked', 'PRESENT', '2026-10-26 19:38:48', 1),
(23, '2026-10-27', 'trainer', 'Excused', 'ABSENT', '2026-10-26 19:38:48', 2),
(24, '2026-10-28', 'trainer', 'Left early', 'ABSENT', '2026-10-26 19:39:08', 1)
ON DUPLICATE KEY UPDATE
    status = VALUES(status),
    remarks = VALUES(remarks),
    marked_by = VALUES(marked_by),
    updated_at = VALUES(updated_at);

-- Set AUTO_INCREMENT to safe high offset
ALTER TABLE users AUTO_INCREMENT = 100;
ALTER TABLE students AUTO_INCREMENT = 100;
ALTER TABLE attendance_records AUTO_INCREMENT = 100;
