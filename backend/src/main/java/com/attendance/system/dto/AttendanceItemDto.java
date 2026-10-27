package com.attendance.system.dto;

import com.attendance.system.model.AttendanceStatus;
import jakarta.validation.constraints.NotNull;

public class AttendanceItemDto {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Status is required")
    private AttendanceStatus status;

    private String remarks;

    public AttendanceItemDto() {}

    public AttendanceItemDto(Long studentId, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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
