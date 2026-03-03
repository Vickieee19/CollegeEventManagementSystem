package com.examly.springapp.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TestController {
    
    @PostMapping("/test-registration")
    public ResponseEntity<?> testRegistration(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok("Test successful - data received: " + data.toString());
    }
    
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Backend is running");
    }
}