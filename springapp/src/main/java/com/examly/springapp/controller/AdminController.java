package com.examly.springapp.controller;

import com.examly.springapp.model.Admin;
import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventRegistration;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.AdminRepository;
import com.examly.springapp.service.EventService;
import com.examly.springapp.service.RegistrationService;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private RegistrationService registrationService;
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalEvents", eventService.getTotalEventCount());
        stats.put("totalUsers", userService.getTotalUserCount());
        stats.put("totalRegistrations", registrationService.getTotalRegistrationCount());
        stats.put("systemHealth", "98%");
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/metrics/total-events")
    public ResponseEntity<Map<String, Object>> getTotalEvents() {
        Map<String, Object> response = new HashMap<>();
        response.put("count", eventService.getTotalEventCount());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/metrics/total-registrations")
    public ResponseEntity<Map<String, Object>> getTotalRegistrations() {
        Map<String, Object> response = new HashMap<>();
        response.put("count", registrationService.getTotalRegistrationCount());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/registrations")
    public ResponseEntity<List<EventRegistration>> getAllRegistrations() {
        return ResponseEntity.ok(registrationService.getAllEventRegistrations());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        User updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(updatedUser);
    }
    
    @PostMapping("/create-admin")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> adminData) {
        String name = adminData.get("name");
        String password = adminData.get("password");
        
        if (adminRepository.existsByName(name)) {
            return ResponseEntity.badRequest().body("Admin already exists");
        }
        
        Admin newAdmin = new Admin(name, passwordEncoder.encode(password));
        adminRepository.save(newAdmin);
        return ResponseEntity.ok("Admin created successfully");
    }
}