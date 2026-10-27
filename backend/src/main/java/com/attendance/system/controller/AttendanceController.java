package com.attendance.system.controller;

import com.attendance.system.dto.*;
import com.attendance.system.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DateAttendanceResponse>> getAttendanceForDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        DateAttendanceResponse response = attendanceService.getAttendanceForDate(date);
        return ResponseEntity.ok(ApiResponse.success("Attendance retrieved for date: " + date, response));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<StudentAttendanceRowDto>> markAttendance(
            @Valid @RequestBody AttendanceMarkRequest request,
            Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "Trainer";
            StudentAttendanceRowDto updated = attendanceService.markAttendance(request, username);
            return ResponseEntity.ok(ApiResponse.success("Attendance marked successfully", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(ApiResponse.error("Failed to mark attendance: " + e.getMessage()));
        }
    }

    @PostMapping("/batch")
    @PreAuthorize("hasAnyRole('TRAINER', 'ADMIN')")
    public ResponseEntity<ApiResponse<DateAttendanceResponse>> batchMarkAttendance(
            @Valid @RequestBody BatchAttendanceRequest request,
            Authentication authentication) {
        try {
            String username = authentication != null ? authentication.getName() : "Trainer";
            DateAttendanceResponse response = attendanceService.batchMarkAttendance(request, username);
            return ResponseEntity.ok(ApiResponse.success("Batch attendance saved for date: " + request.getDate(), response));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to process batch attendance: " + e.getMessage()));
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AttendanceSummaryDto>> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        AttendanceSummaryDto summary = attendanceService.getSummaryForDate(date);
        return ResponseEntity.ok(ApiResponse.success("Attendance summary for " + date, summary));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<StudentAttendanceRowDto>>> getStudentHistory(
            @PathVariable Long studentId) {
        try {
            List<StudentAttendanceRowDto> history = attendanceService.getStudentAttendanceHistory(studentId);
            return ResponseEntity.ok(ApiResponse.success("Attendance history for student", history));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
