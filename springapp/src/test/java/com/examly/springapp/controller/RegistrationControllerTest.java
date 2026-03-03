package com.examly.springapp.controller;

import com.examly.springapp.model.Event;
import com.examly.springapp.model.EventCategory;
import com.examly.springapp.model.Registration;
import com.examly.springapp.model.Student;
import com.examly.springapp.service.RegistrationService;
import com.examly.springapp.security.JwtUtil;
import com.examly.springapp.security.JwtAuthenticationFilter;
import com.examly.springapp.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.test.context.support.WithMockUser;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RegistrationController.class)
@AutoConfigureMockMvc
public class RegistrationControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RegistrationService registrationService;
    
    @MockBean
    private JwtUtil jwtUtil;
    
    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @MockBean
    private UserService userService;

    private ObjectMapper mapper;
    private Student testStudent;
    private Event testEvent;
    private Registration testReg;

    @BeforeEach
    public void setup() {
        mapper = new ObjectMapper().registerModule(new JavaTimeModule());
        testStudent = Student.builder().studentId("S12345").name("Test Student")
            .email("student@example.com").department("CS").build();
        testEvent = Event.builder().eventId(1L).eventName("Tech Symposium 2023").description("A")
            .date(LocalDate.now())
            .time("10:00 AM").venue("Main Auditorium").capacity(1).category(EventCategory.TECHNICAL).build();
        testReg = Registration.builder().id(10L).student(testStudent).event(testEvent)
            .registrationDate(LocalDateTime.now()).attended(false).build();
    }

    @Test
    @WithMockUser
    public void testRegistrationSuccess() throws Exception {
        when(registrationService.registerStudent(eq("S12345"), eq(1L))).thenReturn(testReg);
        String payload = "{\"studentId\":\"S12345\",\"eventId\":1}";
        mockMvc.perform(post("/api/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(10L));
    }

    @Test
    @WithMockUser
    public void testRegistrationDuplicate() throws Exception {
        when(registrationService.registerStudent(eq("S12345"), eq(1L)))
                .thenThrow(new DataIntegrityViolationException("Student already registered for this event"));
        String payload = "{\"studentId\":\"S12345\",\"eventId\":1}";
        mockMvc.perform(post("/api/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Student already registered for this event"));
    }

    @Test
    @WithMockUser
    public void testRegistrationCapacityFull() throws Exception {
        when(registrationService.registerStudent(eq("S12345"), eq(1L)))
                .thenThrow(new ValidationException("Event is at full capacity"));
        String payload = "{\"studentId\":\"S12345\",\"eventId\":1}";
        mockMvc.perform(post("/api/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Event is at full capacity"));
    }

    @Test
    @WithMockUser
    public void testRegistrationInvalidStudentOrEvent() throws Exception {
        when(registrationService.registerStudent(eq("S00000"), eq(1L)))
                .thenThrow(new ValidationException("Student not found"));
        String payload = "{\"studentId\":\"S00000\",\"eventId\":1}";
        mockMvc.perform(post("/api/registrations")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Student not found"));
    }

    @Test
    @WithMockUser
    public void testGetStudentRegistrationsSuccess() throws Exception {
        List<Registration> regs = Collections.singletonList(testReg);
        when(registrationService.getStudentRegistrations("S12345")).thenReturn(regs);
        mockMvc.perform(get("/api/registrations/students/S12345"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(10L));
    }

    @Test
    @WithMockUser
    public void testGetStudentRegistrationsNotFound() throws Exception {
        when(registrationService.getStudentRegistrations("S12345"))
                .thenThrow(new ValidationException("Student not found"));
        mockMvc.perform(get("/api/registrations/students/S12345"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Student not found"));
    }
}
