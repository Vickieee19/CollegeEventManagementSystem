package com.examly.springapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @NotNull
    @Size(min = 5, max = 100, message = "eventName must be between 5 and 100 characters")
    private String eventName;

    private String description;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String time;

    @NotBlank
    private String venue;

    @Min(value = 1, message = "Capacity must be positive")
    private int capacity;
    
    @Builder.Default
    private int registeredCount = 0;

    @Enumerated(EnumType.STRING)
    private EventCategory category;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private EventStatus status = EventStatus.ACTIVE;
}
