package com.examly.springapp.controller;

import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventCategory;
import com.examly.springapp.service.EventService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EventController.class)
@AutoConfigureMockMvc
public class EventControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventService eventService;

    // Ensure consistent JavaTimeModule registration
    private ObjectMapper mapper;

    private Event testEvent;

    @BeforeEach
    public void setup() {
        mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        testEvent = Event.builder()
                .eventId(1L)
                .eventName("Tech Symposium 2023")
                .description("Annual technology showcase featuring student projects")
                .date(LocalDate.of(2023, 11, 15))
                .time("10:00 AM")
                .venue("Main Auditorium")
                .capacity(200)
                .category(EventCategory.TECHNICAL)
                .build();
    }

    @Test
    public void testCreateEventSuccess() throws Exception {
        Event eventToCreate = testEvent;
        when(eventService.createEvent(any(Event.class))).thenReturn(eventToCreate);
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(eventToCreate)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventId").value(eventToCreate.getEventId()));
    }

    @Test
    public void testCreateEventValidationError() throws Exception {
        // Attempt to create an event with short name to trigger validation
        Event badEvent = Event.builder()
                .eventName("Te") // Below min size
                .date(LocalDate.of(2023, 11, 15))
                .time("10:00 AM")
                .venue("Main Auditorium")
                .capacity(-5) // Also invalid
                .category(EventCategory.TECHNICAL)
                .build();
        // Mock: simulate the default contract (validation exception with message prioritizing eventName)
        when(eventService.createEvent(any(Event.class)))
                .thenThrow(new jakarta.validation.ValidationException("eventName must be between 5 and 100 characters"));
        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(badEvent)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("eventName must be between 5 and 100 characters"));
    }

    @Test
    public void testGetAllEventsReturnsPagination() throws Exception {
        List<Event> events = Arrays.asList(testEvent);
        Page<Event> page = new PageImpl<>(events, PageRequest.of(0, 10), events.size());
        when(eventService.getEvents(anyInt(), anyInt())).thenReturn(page);
        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].eventName").value("Tech Symposium 2023"));
    }

    @Test
    public void testGetEventByIdFound() throws Exception {
        when(eventService.getEventById(anyLong())).thenReturn(Optional.of(testEvent));
        mockMvc.perform(get("/api/events/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eventId").value(1));
    }

    @Test
    public void testGetEventByIdNotFound() throws Exception {
        when(eventService.getEventById(anyLong())).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/events/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Event not found"));
    }
}
