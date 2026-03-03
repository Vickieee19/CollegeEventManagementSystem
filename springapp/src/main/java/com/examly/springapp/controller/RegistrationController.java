package com.examly.springapp.controller;

import com.examly.springapp.model.*;
import com.examly.springapp.repository.*;
import com.examly.springapp.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private EventRegistrationRepository eventRegistrationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private RegistrationService registrationService;

    @PostMapping("/registrations")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, Object> data) {
        try {
            Long eventId = Long.valueOf(data.get("eventId").toString());
            String studentId = (String) data.get("studentId");
            String studentName = (String) data.get("studentName");
            String email = (String) data.get("email");
            String department = (String) data.get("department");
            String year = (String) data.get("year");
            String phone = (String) data.get("phone");
            
            System.out.println("Registration attempt - EventID: " + eventId + ", StudentID: " + studentId);
            
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event == null) {
                System.out.println("Event not found: " + eventId);
                return ResponseEntity.badRequest().body("Event not found");
            }
            System.out.println("Event found: " + event.getEventName());
            
            // Check if event is completed
            if (event.getStatus() == EventStatus.COMPLETED) {
                System.out.println("Cannot register for completed event");
                return ResponseEntity.badRequest().body("Cannot register for completed event");
            }
            
            // Check if already registered using studentId and eventId
            if (eventRegistrationRepository.existsByStudentIdAndEventId(studentId, eventId)) {
                System.out.println("Student already registered for this event");
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "ALREADY_REGISTERED",
                    "message", "You are already registered for this event"
                ));
            }
            
            // Find or create user if authenticated
            User user = null;
            try {
                user = userRepository.findByUsername(studentId).orElse(null);
            } catch (Exception e) {
                System.out.println("User lookup failed, proceeding without user association");
            }
            
            // Create registration with or without user association
            EventRegistration registration = new EventRegistration(event, studentName, studentId, email, department, year, phone);
            if (user != null) {
                registration.setUser(user);
            }
            
            EventRegistration saved = eventRegistrationRepository.save(registration);
            System.out.println("Registration saved with ID: " + saved.getId());
            System.out.println("Registration details - StudentID: " + saved.getStudentId() + ", Event: " + saved.getEvent().getEventName());
            
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "registrationId", saved.getId(),
                "eventName", event.getEventName(),
                "studentName", studentName
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @GetMapping("/registrations")
    public List<EventRegistration> getAllRegistrations() {
        List<EventRegistration> registrations = eventRegistrationRepository.findAll();
        System.out.println("Total registrations in database: " + registrations.size());
        for (EventRegistration reg : registrations) {
            System.out.println("Registration ID: " + reg.getId() + ", Student: " + reg.getStudentName() + ", Event: " + reg.getEventName());
        }
        return registrations;
    }

    @GetMapping("/registrations/event/{eventId}")
    public List<EventRegistration> getRegistrationsByEvent(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null) return List.of();
        List<EventRegistration> registrations = eventRegistrationRepository.findByEvent(event);
        System.out.println("Found " + registrations.size() + " registrations for event " + eventId);
        for (EventRegistration reg : registrations) {
            System.out.println("Registration ID: " + reg.getId() + ", Student: " + reg.getStudentName() + ", Attended: " + reg.isAttended());
        }
        return registrations;
    }

    @GetMapping("/registrations/student/{studentId}")
    public ResponseEntity<?> getRegistrationsByStudent(@PathVariable String studentId) {
        try {
            List<EventRegistration> registrations = eventRegistrationRepository.findByStudentId(studentId);
            return ResponseEntity.ok(registrations);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/registrations/{id}")
    public ResponseEntity<?> getRegistrationById(@PathVariable Long id) {
        try {
            EventRegistration registration = eventRegistrationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with ID: " + id));
            return ResponseEntity.ok(registration);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration not found: " + e.getMessage());
        }
    }

    @GetMapping("/registrations/check/{studentId}/{eventId}")
    public ResponseEntity<Boolean> checkRegistration(@PathVariable String studentId, @PathVariable Long eventId) {
        try {
            boolean isRegistered = eventRegistrationRepository.existsByStudentIdAndEventId(studentId, eventId);
            return ResponseEntity.ok(isRegistered);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }
    
    @GetMapping("/registrations/debug/all")
    public ResponseEntity<?> getAllRegistrationsDebug() {
        try {
            List<EventRegistration> allRegistrations = eventRegistrationRepository.findAll();
            System.out.println("=== DEBUG: All Registrations ===");
            for (EventRegistration reg : allRegistrations) {
                System.out.println("ID: " + reg.getId() + ", StudentID: " + reg.getStudentId() + ", Event: " + reg.getEvent().getEventName());
            }
            return ResponseEntity.ok(allRegistrations.stream().map(reg -> Map.of(
                "id", reg.getId(),
                "studentId", reg.getStudentId(),
                "eventName", reg.getEvent().getEventName(),
                "studentName", reg.getStudentName(),
                "email", reg.getEmail(),
                "department", reg.getDepartment(),
                "registrationDate", reg.getRegistrationDate()
            )).toList());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Debug failed: " + e.getMessage());
        }
    }

    @PutMapping("/registrations/{id}/attendance")
    public ResponseEntity<?> markAttendance(@PathVariable Long id, @RequestParam Boolean attended) {
        try {
            System.out.println("Marking attendance for registration ID: " + id + ", attended: " + attended);
            
            // First check if registration exists
            if (!eventRegistrationRepository.existsById(id)) {
                System.err.println("Registration with ID " + id + " does not exist");
                // List all existing IDs for debugging
                List<EventRegistration> allRegs = eventRegistrationRepository.findAll();
                System.err.println("Available registration IDs: " + allRegs.stream().map(r -> r.getId()).toList());
                return ResponseEntity.badRequest().body("Registration not found with ID: " + id);
            }
            
            EventRegistration registration = eventRegistrationRepository.findById(id).get();
            System.out.println("Found registration for student: " + registration.getStudentName());
            
            registration.setAttended(attended);
            EventRegistration updatedRegistration = eventRegistrationRepository.save(registration);
            
            System.out.println("Successfully updated attendance to: " + updatedRegistration.isAttended());
            
            return ResponseEntity.ok(updatedRegistration);
        } catch (Exception e) {
            System.err.println("Error updating attendance: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update attendance: " + e.getMessage());
        }
    }
}