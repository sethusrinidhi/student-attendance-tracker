package com.attendance.system.dto;

import com.attendance.system.model.AttendanceStatus;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class AttendanceMarkRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotNull(message = "Attendance status is required (PRESENT or ABSENT)")
    private AttendanceStatus status;

    private String remarks;

    public AttendanceMarkRequest() {}

    public AttendanceMarkRequest(Long studentId, LocalDate date, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.date = date;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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
}
