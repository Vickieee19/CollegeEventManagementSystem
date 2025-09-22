package com.examly.springapp.service;

import com.examly.springapp.model.Event;
import com.examly.springapp.model.Registration;
import com.examly.springapp.model.Student;
import com.examly.springapp.repository.EventRepository;
import com.examly.springapp.repository.RegistrationRepository;
import com.examly.springapp.repository.StudentRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistrationService {
    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private EventRepository eventRepository;

    public Registration registerStudent(String studentId, Long eventId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ValidationException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ValidationException("Event not found"));

        List<Registration> existing = registrationRepository.findByStudent(student);
        if (existing.stream().anyMatch(r -> r.getEvent().getEventId().equals(eventId))) {
            throw new DataIntegrityViolationException("Student already registered for this event");
        }

        if (event.getCapacity() <= 0) {
            throw new ValidationException("Event is at full capacity");
        }

        // Reduce capacity
        event.setCapacity(event.getCapacity() - 1);
        eventRepository.save(event);

        Registration reg = Registration.builder()
                .student(student)
                .event(event)
                .registrationDate(LocalDateTime.now())
                .attended(false)
                .build();

        return registrationRepository.save(reg);
    }

    public List<Registration> getStudentRegistrations(String studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(()-> new ValidationException("Student not found"));
            return registrationRepository.findByStudent(student);
        }
}
