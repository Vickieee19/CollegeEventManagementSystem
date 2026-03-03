package com.examly.springapp.controller;

import com.examly.springapp.service.EventService;
import com.examly.springapp.repository.EventRegistrationRepository;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {

    @Autowired
    private EventService eventService;
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalEvents = eventService.getTotalEventCount();
        long activeEvents = eventService.getAllEvents().stream()
            .filter(event -> event.getDate().isAfter(LocalDate.now()) || event.getDate().isEqual(LocalDate.now()))
            .count();
        long totalRegistrations = registrationRepository.count();
        long todayRegistrations = registrationRepository.countByRegistrationDate(LocalDate.now());
        
        stats.put("totalEvents", totalEvents);
        stats.put("activeEvents", activeEvents);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("todayRegistrations", todayRegistrations);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-activity")
    public ResponseEntity<Map<String, Object>> getRecentActivity() {
        Map<String, Object> response = new HashMap<>();
        
        // Get recent registrations
        var recentRegistrations = registrationRepository.findTop10ByOrderByRegistrationDateDesc();
        
        response.put("recentRegistrations", recentRegistrations);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/registration-trends")
    public ResponseEntity<Map<String, Object>> getRegistrationTrends() {
        Map<String, Object> response = new HashMap<>();
        
        // Get monthly registration counts for the last 12 months
        var monthlyData = registrationRepository.getMonthlyRegistrationCounts();
        
        response.put("monthlyData", monthlyData);
        
        return ResponseEntity.ok(response);
    }
}