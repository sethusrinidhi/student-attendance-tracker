package com.attendance.system.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BatchAttendanceRequest {
    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotEmpty(message = "At least one attendance item must be provided")
    private List<AttendanceItemDto> items;

    public BatchAttendanceRequest() {}

    public BatchAttendanceRequest(LocalDate date, List<AttendanceItemDto> items) {
        this.date = date;
        this.items = items;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<AttendanceItemDto> getItems() {
        return items;
    }

    public void setItems(List<AttendanceItemDto> items) {
        this.items = items;
    }
}
