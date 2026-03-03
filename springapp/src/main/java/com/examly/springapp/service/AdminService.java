package com.examly.springapp.service;

import com.examly.springapp.model.Admin;
import com.examly.springapp.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean validateAdmin(String username, String password) {
        Admin admin = adminRepository.findByUsername(username).orElse(null);
        return admin != null && passwordEncoder.matches(password, admin.getPassword());
    }
    
    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username).orElse(null);
    }
}