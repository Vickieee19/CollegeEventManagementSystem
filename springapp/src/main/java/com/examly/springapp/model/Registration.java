package com.examly.springapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "registrations")
public class Registration {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;
    
    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Column(name = "registration_date", nullable = false)
    private LocalDateTime registrationDate;
    
    @Column(name = "attended", nullable = false)
    @Builder.Default
    private Boolean attended = false;
    
    // Legacy fields for backward compatibility and direct frontend mapping
    @Transient
    private Long eventId;
    
    @Transient
    private String studentId;
    
    @Column(name = "event_name")
    private String eventName;
    
    @Column(name = "student_name")
    private String studentName;
    
    @Column(name = "email")
    private String email;
    
    @Column(name = "department")
    private String department;
    
    @Column(name = "year")
    private String year;
    
    @Column(name = "phone")
    private String phone;
}