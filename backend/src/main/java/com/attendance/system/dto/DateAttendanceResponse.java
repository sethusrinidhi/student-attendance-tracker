package com.attendance.system.dto;

import java.time.LocalDate;
import java.util.List;

public class DateAttendanceResponse {
    private LocalDate date;
    private AttendanceSummaryDto summary;
    private List<StudentAttendanceRowDto> records;

    public DateAttendanceResponse() {}

    public DateAttendanceResponse(LocalDate date, AttendanceSummaryDto summary, List<StudentAttendanceRowDto> records) {
        this.date = date;
        this.summary = summary;
        this.records = records;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public AttendanceSummaryDto getSummary() {
        return summary;
    }

    public void setSummary(AttendanceSummaryDto summary) {
        this.summary = summary;
    }

    public List<StudentAttendanceRowDto> getRecords() {
        return records;
    }

    public void setRecords(List<StudentAttendanceRowDto> records) {
        this.records = records;
    }
}
