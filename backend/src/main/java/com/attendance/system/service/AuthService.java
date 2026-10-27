package com.attendance.system.service;

import com.attendance.system.dto.AuthRequest;
import com.attendance.system.dto.AuthResponse;
import com.attendance.system.dto.RegisterRequest;
import com.attendance.system.model.Role;
import com.attendance.system.model.User;
import com.attendance.system.repository.UserRepository;
import com.attendance.system.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.attendance.system.model.Student;
import com.attendance.system.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getUsername()));

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().name()
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            throw new IllegalArgumentException("Username '" + request.getUsername().trim() + "' is already taken!");
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new IllegalArgumentException("Email '" + request.getEmail().trim() + "' is already registered!");
        }

        Role role = request.getRole() != null ? request.getRole() : Role.ROLE_TRAINER;

        User user = new User(
                request.getUsername().trim(),
                request.getEmail().trim(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName().trim(),
                role
        );

        User savedUser = userRepository.save(user);

        // If registered as Student, link or create student record in the roster
        if (role == Role.ROLE_STUDENT) {
            String roll = (request.getRollNumber() != null && !request.getRollNumber().trim().isEmpty())
                    ? request.getRollNumber().trim().toUpperCase()
                    : null;

            if (roll != null) {
                if (studentRepository.existsByRollNumber(roll)) {
                    throw new IllegalArgumentException("Student roll number '" + roll + "' is already assigned to another student!");
                }
            } else {
                // Auto-generate clean unique roll number
                long count = studentRepository.count() + 1;
                roll = String.format("CS-2026-%03d", count);
                while (studentRepository.existsByRollNumber(roll)) {
                    count++;
                    roll = String.format("CS-2026-%03d", count);
                }
            }

            // Create student in the roster
            Student student = new Student(
                    savedUser.getFullName(),
                    roll,
                    savedUser.getEmail(),
                    request.getPhone() != null && !request.getPhone().trim().isEmpty() ? request.getPhone().trim() : "+1 (555) 000-0000"
            );
            studentRepository.save(student);
        }

        String token = jwtUtils.generateTokenFromUsernameAndRole(savedUser.getUsername(), savedUser.getRole().name());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );
    }
}
