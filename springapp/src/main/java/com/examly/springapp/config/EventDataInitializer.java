package com.examly.springapp.config;

import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventCategory;
import com.examly.springapp.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class EventDataInitializer implements CommandLineRunner {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("EventDataInitializer starting...");
        
        try {
            if (eventRepository.count() == 0) {
                Event event1 = Event.builder()
                    .eventName("Tech Symposium 2024")
                    .description("Annual technology symposium featuring latest innovations")
                    .date(LocalDate.now().plusDays(30))
                    .time("10:00 AM")
                    .venue("Main Auditorium")
                    .capacity(200)
                    .category(EventCategory.TECHNICAL)
                    .build();
                eventRepository.save(event1);
                
                Event event2 = Event.builder()
                    .eventName("Cultural Fest")
                    .description("Celebrate diversity through music, dance and art")
                    .date(LocalDate.now().plusDays(15))
                    .time("6:00 PM")
                    .venue("Campus Ground")
                    .capacity(500)
                    .category(EventCategory.CULTURAL)
                    .build();
                eventRepository.save(event2);
                
                Event event3 = Event.builder()
                    .eventName("Sports Championship")
                    .description("Inter-college sports competition")
                    .date(LocalDate.now().plusDays(45))
                    .time("9:00 AM")
                    .venue("Sports Complex")
                    .capacity(300)
                    .category(EventCategory.SPORTS)
                    .build();
                eventRepository.save(event3);
                
                System.out.println("Created sample events");
            } else {
                System.out.println("Events already exist in database");
            }
        } catch (Exception e) {
            System.out.println("Error in EventDataInitializer: " + e.getMessage());
            e.printStackTrace();
        }
    }
}