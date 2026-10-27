package com.attendance.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_student_roll", columnList = "rollNumber", unique = true),
    @Index(name = "idx_student_name", columnList = "name"),
    @Index(name = "idx_student_email", columnList = "email")
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Student name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Roll number is required")
    @Column(nullable = false, unique = true, length = 30)
    private String rollNumber;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    private LocalDateTime createdAt;

    public Student() {
        this.createdAt = LocalDateTime.now();
    }

    public Student(String name, String rollNumber) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.createdAt = LocalDateTime.now();
    }

    public Student(String name, String rollNumber, String email, String phone) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
        this.phone = phone;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
