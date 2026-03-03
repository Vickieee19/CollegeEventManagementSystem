package com.examly.springapp.controller;

import com.examly.springapp.model.Admin;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.EventRegistrationRepository;
import com.examly.springapp.security.JwtUtil;
import com.examly.springapp.service.AdminService;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private AdminService adminService;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.get("username"), 
                    loginRequest.get("password")
                )
            );
            
            UserDetails userDetails = userService.loadUserByUsername(loginRequest.get("username"));
            String token = jwtUtil.generateToken(userDetails);
            
            // Get the full user object to access name
            com.examly.springapp.model.User user = userService.findByUsername(loginRequest.get("username"));
            Long registrationCount = registrationRepository.countByUserUsername(user.getUsername());
            Long attendedCount = registrationRepository.countAttendedByUserUsername(user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("username", userDetails.getUsername());
            response.put("name", user.getName());
            response.put("rollNo", user.getRollNo());
            response.put("department", user.getDepartment());
            response.put("year", user.getYear());
            response.put("registrationCount", registrationCount);
            response.put("attendedCount", attendedCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userService.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        User savedUser = userService.createUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7); // Remove "Bearer " prefix
            String username = jwtUtil.extractUsername(jwt);
            
            if (jwtUtil.isTokenExpired(jwt)) {
                return ResponseEntity.badRequest().body("Token expired");
            }
            
            User user = userService.findByUsername(username);
            Long registrationCount = registrationRepository.countByUserUsername(user.getUsername());
            Long attendedCount = registrationRepository.countAttendedByUserUsername(user.getUsername());
            
            Map<String, Object> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("name", user.getName());
            response.put("rollNo", user.getRollNo());
            response.put("department", user.getDepartment());
            response.put("year", user.getYear());
            response.put("registrationCount", registrationCount);
            response.put("attendedCount", attendedCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }
    
    @PostMapping("/auth/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        try {
            String name = loginRequest.get("username");
            String password = loginRequest.get("password");
            
            System.out.println("Admin login attempt - Name: " + name);
            
            if (adminService.validateAdmin(name, password)) {
                Admin admin = adminService.findByUsername(name);
                
                // Create a simple token for admin
                String token = "admin_" + System.currentTimeMillis();
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("username", name);
                response.put("name", admin.getName());
                response.put("role", "admin");
                
                System.out.println("Admin login successful for: " + name);
                return ResponseEntity.ok(response);
            } else {
                System.out.println("Invalid admin credentials: " + name);
                return ResponseEntity.badRequest().body("Invalid admin credentials");
            }
        } catch (Exception e) {
            System.out.println("Admin login exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Admin login failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/auth/admin/test")
    public ResponseEntity<?> testAdmin() {
        return ResponseEntity.ok("Admin endpoint working");
    }
    
    @GetMapping("/auth/admin/check")
    public ResponseEntity<?> checkAdmin() {
        try {
            // Test if AdminService is working
            boolean test = adminService.validateAdmin("test", "test");
            return ResponseEntity.ok("AdminService working: " + test);
        } catch (Exception e) {
            return ResponseEntity.ok("AdminService error: " + e.getMessage());
        }
    }
    

}