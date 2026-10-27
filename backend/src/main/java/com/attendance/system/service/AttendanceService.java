package com.attendance.system.service;

import com.attendance.system.dto.*;
import com.attendance.system.model.AttendanceRecord;
import com.attendance.system.model.AttendanceStatus;
import com.attendance.system.model.Student;
import com.attendance.system.repository.AttendanceRepository;
import com.attendance.system.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    public DateAttendanceResponse getAttendanceForDate(LocalDate date) {
        List<Student> students = studentRepository.findAllByOrderByNameAsc();
        List<AttendanceRecord> records = attendanceRepository.findByDate(date);

        Map<Long, AttendanceRecord> recordMap = records.stream()
                .collect(Collectors.toMap(r -> r.getStudent().getId(), r -> r, (r1, r2) -> r1));

        List<StudentAttendanceRowDto> rowDtos = new ArrayList<>();
        long presentCount = 0;
        long absentCount = 0;

        for (Student s : students) {
            AttendanceRecord record = recordMap.get(s.getId());
            AttendanceStatus status = record != null ? record.getStatus() : null;
            String remarks = record != null ? record.getRemarks() : null;
            String markedBy = record != null ? record.getMarkedBy() : null;
            Long attendanceId = record != null ? record.getId() : null;
            LocalDateTime updatedAt = record != null ? record.getUpdatedAt() : null;

            if (status == AttendanceStatus.PRESENT) {
                presentCount++;
            } else if (status == AttendanceStatus.ABSENT) {
                absentCount++;
            }

            rowDtos.add(new StudentAttendanceRowDto(
                    s.getId(),
                    s.getName(),
                    s.getRollNumber(),
                    s.getEmail(),
                    s.getPhone(),
                    attendanceId,
                    status,
                    remarks,
                    markedBy,
                    updatedAt
            ));
        }

        long totalStudents = students.size();
        long unmarkedCount = totalStudents - (presentCount + absentCount);
        double attendancePercentage = totalStudents > 0
                ? Math.round(((double) presentCount / totalStudents * 100.0) * 10.0) / 10.0
                : 0.0;

        AttendanceSummaryDto summary = new AttendanceSummaryDto(
                date,
                totalStudents,
                presentCount,
                absentCount,
                unmarkedCount,
                attendancePercentage
        );

        return new DateAttendanceResponse(date, summary, rowDtos);
    }

    @Transactional
    public StudentAttendanceRowDto markAttendance(AttendanceMarkRequest request, String markedBy) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + request.getStudentId()));

        AttendanceRecord record = attendanceRepository.findByStudentIdAndDate(student.getId(), request.getDate())
                .orElse(new AttendanceRecord());

        record.setStudent(student);
        record.setDate(request.getDate());
        record.setStatus(request.getStatus());
        record.setRemarks(request.getRemarks());
        record.setMarkedBy(markedBy != null ? markedBy : "Trainer");
        record.setUpdatedAt(LocalDateTime.now());

        AttendanceRecord saved = attendanceRepository.save(record);

        return new StudentAttendanceRowDto(
                student.getId(),
                student.getName(),
                student.getRollNumber(),
                student.getEmail(),
                student.getPhone(),
                saved.getId(),
                saved.getStatus(),
                saved.getRemarks(),
                saved.getMarkedBy(),
                saved.getUpdatedAt()
        );
    }

    @Transactional
    public DateAttendanceResponse batchMarkAttendance(BatchAttendanceRequest request, String markedBy) {
        LocalDate date = request.getDate();
        for (AttendanceItemDto item : request.getItems()) {
            Student student = studentRepository.findById(item.getStudentId())
                    .orElse(null);
            if (student == null) continue;

            AttendanceRecord record = attendanceRepository.findByStudentIdAndDate(student.getId(), date)
                    .orElse(new AttendanceRecord());

            record.setStudent(student);
            record.setDate(date);
            record.setStatus(item.getStatus());
            record.setRemarks(item.getRemarks());
            record.setMarkedBy(markedBy != null ? markedBy : "Trainer");
            record.setUpdatedAt(LocalDateTime.now());

            attendanceRepository.save(record);
        }

        return getAttendanceForDate(date);
    }

    public List<StudentAttendanceRowDto> getStudentAttendanceHistory(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + studentId));

        List<AttendanceRecord> records = attendanceRepository.findByStudentIdOrderByDateDesc(studentId);

        return records.stream().map(r -> new StudentAttendanceRowDto(
                student.getId(),
                student.getName(),
                student.getRollNumber(),
                student.getEmail(),
                student.getPhone(),
                r.getId(),
                r.getStatus(),
                r.getRemarks(),
                r.getMarkedBy(),
                r.getUpdatedAt()
        )).collect(Collectors.toList());
    }

    public AttendanceSummaryDto getSummaryForDate(LocalDate date) {
        return getAttendanceForDate(date).getSummary();
    }
}
