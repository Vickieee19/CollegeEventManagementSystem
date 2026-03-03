package com.examly.springapp.controller;

import com.examly.springapp.repository.EventRegistrationRepository;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportsController {

    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.count();
        
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalEvents", totalEvents);
        analytics.put("totalRegistrations", totalRegistrations);
        analytics.put("averageRegistrationsPerEvent", totalEvents > 0 ? (double) totalRegistrations / totalEvents : 0);
        
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/student-details")
    public ResponseEntity<?> getStudentDetails() {
        try {
            var users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching student details: " + e.getMessage());
        }
    }

    @GetMapping("/event-registrations")
    public ResponseEntity<?> getEventRegistrations() {
        try {
            var registrations = registrationRepository.findAll();
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching registrations: " + e.getMessage());
        }
    }

    @GetMapping("/registrations/today")
    public ResponseEntity<?> getTodayRegistrations() {
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            var todayRegistrations = registrationRepository.countByRegistrationDate(today);
            return ResponseEntity.ok(registrationRepository.findAll()); // For now, return all registrations
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching today's registrations: " + e.getMessage());
        }
    }
}