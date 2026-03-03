package com.examly.springapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "event_registrations")
public class EventRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "registration_date")
    private LocalDateTime registrationDate;

    @Column(name = "attended")
    private boolean attended = false;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "student_id")
    private String studentId;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "year")
    private String year;
    
    @Column(name = "phone")
    private String phone;
    
    @Column(name = "event_name")
    private String eventName;

    public EventRegistration() {
        this.registrationDate = LocalDateTime.now();
    }

    public EventRegistration(User user, Event event) {
        this.user = user;
        this.event = event;
        this.registrationDate = LocalDateTime.now();
        this.attended = false;
        this.studentName = user != null ? user.getName() : null;
        this.studentId = user != null ? user.getUsername() : null;
        this.eventName = event.getEventName();
    }
    
    public EventRegistration(Event event, String studentName, String studentId, String email, String department, String year, String phone) {
        this.user = null; // Explicitly set user to null
        this.event = event;
        this.studentName = studentName;
        this.studentId = studentId;
        this.email = email;
        this.department = department;
        this.year = year;
        this.phone = phone;
        this.eventName = event.getEventName();
        this.registrationDate = LocalDateTime.now();
        this.attended = false;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }

    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }

    public boolean isAttended() { return attended; }
    public void setAttended(boolean attended) { this.attended = attended; }
    
    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
    
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public String getYear() { return year; }
    public void setYear(String year) { this.year = year; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }
}