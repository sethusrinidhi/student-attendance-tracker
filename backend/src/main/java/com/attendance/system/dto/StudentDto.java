package com.attendance.system.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class StudentDto {
    private Long id;

    @NotBlank(message = "Student name is required")
    private String name;

    @NotBlank(message = "Roll number is required")
    private String rollNumber;

    private String email;
    private String phone;
    private LocalDateTime createdAt;

    public StudentDto() {}

    public StudentDto(Long id, String name, String rollNumber, String email, String phone, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
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
