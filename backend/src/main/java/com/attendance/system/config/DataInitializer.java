package com.attendance.system.config;

import com.attendance.system.model.*;
import com.attendance.system.repository.AttendanceRepository;
import com.attendance.system.repository.StudentRepository;
import com.attendance.system.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           AttendanceRepository attendanceRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedStudentsAndAttendance();
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("trainer")) {
            User trainer = new User(
                    "trainer",
                    "trainer@academy.edu",
                    passwordEncoder.encode("trainer123"),
                    "Prof. Sarah Jenkins",
                    Role.ROLE_TRAINER
            );
            userRepository.save(trainer);
        }

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@academy.edu",
                    passwordEncoder.encode("admin123"),
                    "Campus Administrator",
                    Role.ROLE_ADMIN
            );
            userRepository.save(admin);
        }

        if (!userRepository.existsByUsername("student")) {
            User studentUser = new User(
                    "student",
                    "aarav@academy.edu",
                    passwordEncoder.encode("student123"),
                    "Aarav Sharma",
                    Role.ROLE_STUDENT
            );
            userRepository.save(studentUser);
        }
    }

    private void seedStudentsAndAttendance() {
        if (studentRepository.count() == 0) {
            List<Student> initialStudents = List.of(
                    new Student("Aarav Sharma", "CS-2026-001", "aarav@academy.edu", "+1 (555) 101-2001"),
                    new Student("Diya Patel", "CS-2026-002", "diya@academy.edu", "+1 (555) 101-2002"),
                    new Student("Rohan Verma", "CS-2026-003", "rohan@academy.edu", "+1 (555) 101-2003"),
                    new Student("Ananya Iyer", "CS-2026-004", "ananya@academy.edu", "+1 (555) 101-2004"),
                    new Student("Karthik Nair", "CS-2026-005", "karthik@academy.edu", "+1 (555) 101-2005"),
                    new Student("Priya Reddy", "CS-2026-006", "priya@academy.edu", "+1 (555) 101-2006"),
                    new Student("Vikram Singh", "CS-2026-007", "vikram@academy.edu", "+1 (555) 101-2007"),
                    new Student("Sneha Kulkarni", "CS-2026-008", "sneha@academy.edu", "+1 (555) 101-2008"),
                    new Student("Mohammed Zaid", "CS-2026-009", "zaid@academy.edu", "+1 (555) 101-2009"),
                    new Student("Meera Nambiar", "CS-2026-010", "meera@academy.edu", "+1 (555) 101-2010")
            );

            List<Student> savedStudents = studentRepository.saveAll(initialStudents);

            // Pre-seed attendance for today (current date)
            LocalDate today = LocalDate.now();
            LocalDate yesterday = today.minusDays(1);

            // Today's attendance (8 present, 2 absent)
            for (int i = 0; i < savedStudents.size(); i++) {
                Student s = savedStudents.get(i);
                AttendanceStatus status = (i == 2 || i == 6) ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
                String remarks = (status == AttendanceStatus.ABSENT) ? "Informed via email - unwell" : "On time";
                AttendanceRecord record = new AttendanceRecord(s, today, status, remarks, "trainer");
                attendanceRepository.save(record);
            }

            // Yesterday's attendance (9 present, 1 absent)
            for (int i = 0; i < savedStudents.size(); i++) {
                Student s = savedStudents.get(i);
                AttendanceStatus status = (i == 4) ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT;
                String remarks = (status == AttendanceStatus.ABSENT) ? "Medical leave" : "Present";
                AttendanceRecord record = new AttendanceRecord(s, yesterday, status, remarks, "trainer");
                attendanceRepository.save(record);
            }
        }
    }
}
