package com.examly.springapp.controller;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventRegistration;
import com.examly.springapp.model.EventStatus;
import com.examly.springapp.model.User;
import com.examly.springapp.repository.EventRegistrationRepository;
import com.examly.springapp.service.EventService;
import com.examly.springapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class EventController {
    @Autowired
    private EventService eventService;
    
    @Autowired
    private EventRegistrationRepository registrationRepository;
    
    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        Event saved = eventService.createEvent(event);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event event) {
        return eventService.getEventById(id)
                .map(existingEvent -> {
                    event.setEventId(id);
                    Event updated = eventService.createEvent(event);
                    return ResponseEntity.ok(updated);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(event -> {
                    // Delete all registrations for this event first
                    List<EventRegistration> registrations = registrationRepository.findByEvent(event);
                    registrationRepository.deleteAll(registrations);
                    
                    // Then delete the event
                    eventService.deleteEvent(id);
                    return ResponseEntity.ok().build();
                })
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> toggleEventStatus(@PathVariable Long id) {
        try {
            System.out.println("Toggling status for event ID: " + id);
            return eventService.getEventById(id)
                    .map(event -> {
                        EventStatus currentStatus = event.getStatus() != null ? event.getStatus() : EventStatus.ACTIVE;
                        EventStatus newStatus = currentStatus == EventStatus.ACTIVE ? EventStatus.COMPLETED : EventStatus.ACTIVE;
                        System.out.println("Current status: " + currentStatus + ", New status: " + newStatus);
                        event.setStatus(newStatus);
                        Event updated = eventService.createEvent(event);
                        return ResponseEntity.ok(updated);
                    })
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        } catch (Exception e) {
            System.err.println("Error toggling event status: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to toggle status: " + e.getMessage());
        }
    }

    @GetMapping
    public Page<Event> getEvents(@RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "10") int size) {
        return eventService.getEvents(page, size);
    }
    
    @GetMapping("/with-status/{username}")
    public ResponseEntity<?> getEventsWithStatus(@PathVariable String username,
                                                  @RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        try {
            Page<Event> events = eventService.getEvents(page, size);
            List<Map<String, Object>> eventsWithStatus = events.getContent().stream().map(event -> {
                Map<String, Object> eventData = new HashMap<>();
                eventData.put("id", event.getEventId());
                eventData.put("eventName", event.getEventName());
                eventData.put("description", event.getDescription());
                eventData.put("date", event.getDate());
                eventData.put("time", event.getTime());
                eventData.put("venue", event.getVenue());
                eventData.put("capacity", event.getCapacity());
                eventData.put("category", event.getCategory());
                eventData.put("status", event.getStatus() != null ? event.getStatus().toString() : "ACTIVE");
                eventData.put("isRegistered", registrationRepository.existsByUserUsernameAndEventId(username, event.getEventId()));
                // Get actual registration count from database
                long registrationCount = registrationRepository.countByEventEventId(event.getEventId());
                eventData.put("registeredCount", registrationCount);
                System.out.println("Event " + event.getEventName() + " has " + registrationCount + " registrations");
                return eventData;
            }).toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("content", eventsWithStatus);
            response.put("totalElements", events.getTotalElements());
            response.put("totalPages", events.getTotalPages());
            response.put("size", events.getSize());
            response.put("number", events.getNumber());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch events: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
    }
    
    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> registerForEvent(@PathVariable Long eventId, @RequestParam String username) {
        try {
            if (registrationRepository.existsByUserUsernameAndEventId(username, eventId)) {
                return ResponseEntity.badRequest().body("Already registered for this event");
            }
            
            User user = userService.findByUsername(username);
            Event event = eventService.getEventById(eventId)
                    .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
            
            if (event.getStatus() == EventStatus.COMPLETED) {
                return ResponseEntity.badRequest().body("Cannot register for completed event");
            }
            
            EventRegistration registration = new EventRegistration(user, event);
            registrationRepository.save(registration);
            
            // Update the event's registered count
            long newCount = registrationRepository.countByEventEventId(eventId);
            event.setRegisteredCount((int) newCount);
            eventService.createEvent(event);
            
            System.out.println("Registration successful for user " + username + " to event " + eventId + ". New count: " + newCount);
            
            return ResponseEntity.ok("Successfully registered for event");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    @GetMapping("/user/{username}/registrations")
    public ResponseEntity<?> getUserRegistrations(@PathVariable String username) {
        try {
            System.out.println("Fetching registrations for username: " + username);
            
            // Try to get stats by username first
            Long registrationCount = registrationRepository.countByUserUsername(username);
            Long attendedCount = registrationRepository.countAttendedByUserUsername(username);
            
            // If no results, try by studentId
            if (registrationCount == 0) {
                registrationCount = registrationRepository.countByStudentId(username);
                attendedCount = registrationRepository.countAttendedByStudentId(username);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("count", registrationCount);
            response.put("attendedCount", attendedCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("count", 0);
            response.put("attendedCount", 0);
            return ResponseEntity.ok(response);
        }
    }
}
