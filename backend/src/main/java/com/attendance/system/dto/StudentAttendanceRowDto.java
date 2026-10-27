package com.attendance.system.dto;

import com.attendance.system.model.AttendanceStatus;
import java.time.LocalDateTime;

public class StudentAttendanceRowDto {
    private Long studentId;
    private String name;
    private String rollNumber;
    private String email;
    private String phone;
    private Long attendanceId;
    private AttendanceStatus status;
    private String remarks;
    private String markedBy;
    private LocalDateTime updatedAt;

    public StudentAttendanceRowDto() {}

    public StudentAttendanceRowDto(Long studentId, String name, String rollNumber, String email, String phone,
                                  Long attendanceId, AttendanceStatus status, String remarks, String markedBy,
                                  LocalDateTime updatedAt) {
        this.studentId = studentId;
        this.name = name;
        this.rollNumber = rollNumber;
        this.email = email;
        this.phone = phone;
        this.attendanceId = attendanceId;
        this.status = status;
        this.remarks = remarks;
        this.markedBy = markedBy;
        this.updatedAt = updatedAt;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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

    public Long getAttendanceId() {
        return attendanceId;
    }

    public void setAttendanceId(Long attendanceId) {
        this.attendanceId = attendanceId;
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
