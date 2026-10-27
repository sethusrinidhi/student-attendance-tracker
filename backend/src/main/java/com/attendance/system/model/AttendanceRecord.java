package com.attendance.system.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", 
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_date", columnNames = {"student_id", "attendance_date"})
    },
    indexes = {
        @Index(name = "idx_attendance_date", columnList = "attendance_date"),
        @Index(name = "idx_attendance_date_status", columnList = "attendance_date, status"),
        @Index(name = "idx_attendance_student_id", columnList = "student_id")
    }
)
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private AttendanceStatus status;
    
    @Column(length = 255)
    private String remarks;

    @Column(length = 50)
    private String markedBy;

    private LocalDateTime updatedAt;

    public AttendanceRecord() {
        this.updatedAt = LocalDateTime.now();
    }

    public AttendanceRecord(Student student, LocalDate date, AttendanceStatus status, String remarks, String markedBy) {
        this.student = student;
        this.date = date;
        this.status = status;
        this.remarks = remarks;
        this.markedBy = markedBy;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(AttendanceStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public String getMarkedBy() {
        return markedBy;
    }

    public void setMarkedBy(String markedBy) {
        this.markedBy = markedBy;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
