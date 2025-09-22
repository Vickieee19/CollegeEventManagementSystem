package com.examly.springapp.controller;

import com.examly.springapp.model.Registration;
import com.examly.springapp.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {
    @Autowired
    private RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<Registration> register(@RequestBody Map<String, Object> payload) {
        String studentId = (String) payload.get("studentId");
        Long eventId = Long.valueOf(payload.get("eventId").toString());
        Registration saved = registrationService.registerStudent(studentId, eventId);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<List<Registration>> getRegistrations(@PathVariable String studentId) {
        List<Registration> regs = registrationService.getStudentRegistrations(studentId);
        return ResponseEntity.ok(regs);
    }
}
