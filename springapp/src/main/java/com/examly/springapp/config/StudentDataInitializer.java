package com.examly.springapp.config;

import com.examly.springapp.model.User;
import com.examly.springapp.model.Role;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class StudentDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("StudentDataInitializer starting...");
        
        try {
            if (!userRepository.existsByUsername("student1")) {
                User student = User.builder()
                    .username("student1")
                    .password(passwordEncoder.encode("student123"))
                    .email("student1@college.edu")
                    .name("John Student")
                    .role(Role.STUDENT)
                    .build();
                userRepository.save(student);
                System.out.println("Created student user: student1");
            }
            
        } catch (Exception e) {
            System.out.println("Error in StudentDataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== STUDENT LOGIN CREDENTIALS ===");
        System.out.println("Username: student1, Password: student123");
        System.out.println("==================================");
    }
}