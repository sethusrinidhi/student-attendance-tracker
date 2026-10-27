package com.attendance.system.dto;

import java.time.LocalDate;

public class AttendanceSummaryDto {
    private LocalDate date;
    private long totalStudents;
    private long presentCount;
    private long absentCount;
    private long unmarkedCount;
    private double attendancePercentage;

    public AttendanceSummaryDto() {}

    public AttendanceSummaryDto(LocalDate date, long totalStudents, long presentCount, long absentCount, long unmarkedCount, double attendancePercentage) {
        this.date = date;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.unmarkedCount = unmarkedCount;
        this.attendancePercentage = attendancePercentage;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getPresentCount() {
        return presentCount;
    }

    public void setPresentCount(long presentCount) {
        this.presentCount = presentCount;
    }

    public long getAbsentCount() {
        return absentCount;
    }

    public void setAbsentCount(long absentCount) {
        this.absentCount = absentCount;
    }

    public long getUnmarkedCount() {
        return unmarkedCount;
    }

    public void setUnmarkedCount(long unmarkedCount) {
        this.unmarkedCount = unmarkedCount;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}
