package com.attendance.system.repository;

import com.attendance.system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    Boolean existsByRollNumber(String rollNumber);
    Optional<Student> findByEmailIgnoreCase(String email);
    Boolean existsByEmailIgnoreCase(String email);
    List<Student> findAllByOrderByNameAsc();
    List<Student> findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(String name, String rollNumber);
}
