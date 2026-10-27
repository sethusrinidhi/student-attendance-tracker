package com.attendance.system.service;

import com.attendance.system.dto.StudentDto;
import com.attendance.system.model.Student;
import com.attendance.system.repository.AttendanceRepository;
import com.attendance.system.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public StudentService(StudentRepository studentRepository, AttendanceRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    public List<StudentDto> getAllStudents() {
        return studentRepository.findAllByOrderByNameAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));
        return mapToDto(student);
    }

    @Transactional
    public StudentDto addStudent(StudentDto dto) {
        String rollNumber = dto.getRollNumber().trim().toUpperCase();
        if (studentRepository.existsByRollNumber(rollNumber)) {
            throw new IllegalArgumentException("A student with Roll Number '" + rollNumber + "' already exists.");
        }

        Student student = new Student(
                dto.getName().trim(),
                rollNumber,
                dto.getEmail() != null ? dto.getEmail().trim() : null,
                dto.getPhone() != null ? dto.getPhone().trim() : null
        );

        Student saved = studentRepository.save(student);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
        attendanceRepository.deleteByStudentId(id);
        studentRepository.deleteById(id);
    }

    public List<StudentDto> searchStudents(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllStudents();
        }
        return studentRepository.findByNameContainingIgnoreCaseOrRollNumberContainingIgnoreCase(query.trim(), query.trim())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private StudentDto mapToDto(Student student) {
        return new StudentDto(
                student.getId(),
                student.getName(),
                student.getRollNumber(),
                student.getEmail(),
                student.getPhone(),
                student.getCreatedAt()
        );
    }
}
