package com.attendance.system.repository;

import com.attendance.system.model.AttendanceRecord;
import com.attendance.system.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {
    
    Optional<AttendanceRecord> findByStudentIdAndDate(Long studentId, LocalDate date);
    
    List<AttendanceRecord> findByDate(LocalDate date);
    
    List<AttendanceRecord> findByStudentIdOrderByDateDesc(Long studentId);
    
    long countByDateAndStatus(LocalDate date, AttendanceStatus status);
    
    long countByDate(LocalDate date);
    
    List<AttendanceRecord> findByDateBetween(LocalDate startDate, LocalDate endDate);

    void deleteByStudentId(Long studentId);
}
