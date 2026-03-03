package com.examly.springapp.config;

import com.examly.springapp.model.Admin;
import com.examly.springapp.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("AdminDataInitializer starting...");
        
        try {
            if (!adminRepository.existsByUsername("vicky")) {
                Admin admin1 = new Admin("vicky", passwordEncoder.encode("vicky123"));
                adminRepository.save(admin1);
                System.out.println("Created admin: vicky");
            } else {
                System.out.println("Admin vicky already exists");
            }
            
            if (!adminRepository.existsByUsername("admin")) {
                Admin admin2 = new Admin("admin", passwordEncoder.encode("admin123"));
                adminRepository.save(admin2);
                System.out.println("Created admin: admin");
            } else {
                System.out.println("Admin admin already exists");
            }
            
            if (!adminRepository.existsByUsername("newadmin")) {
                Admin admin3 = new Admin("newadmin", passwordEncoder.encode("newpass123"));
                adminRepository.save(admin3);
                System.out.println("Created admin: newadmin");
            } else {
                System.out.println("Admin newadmin already exists");
            }
            
            System.out.println("All admins in database:");
            adminRepository.findAll().forEach(admin -> 
                System.out.println("ID: " + admin.getId() + ", Name: " + admin.getName() + ", Username: " + admin.getUsername())
            );
            
        } catch (Exception e) {
            System.out.println("Error in AdminDataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=== ADMIN LOGIN CREDENTIALS ===");
        System.out.println("Username: vicky, Password: vicky123");
        System.out.println("Username: admin, Password: admin123");
        System.out.println("===============================");
    }
}