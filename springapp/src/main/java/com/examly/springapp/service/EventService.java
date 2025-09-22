package com.examly.springapp.service;

import com.examly.springapp.exception.ResourceNotFoundException;
import com.examly.springapp.model.Event;
import com.examly.springapp.repository.EventRepository;
import jakarta.validation.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public Event createEvent(Event event) {
        if (event.getEventName() == null || event.getEventName().length() < 5) {
            throw new ValidationException("eventName must be between 5 and 100 characters");
        }
        if (event.getCapacity() <= 0) {
            throw new ValidationException("Capacity must be positive");
        }
        return eventRepository.save(event);
    }

    public Page<Event> getEvents(int page, int size) {
        return eventRepository.findAll(PageRequest.of(page, size));
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }
}
