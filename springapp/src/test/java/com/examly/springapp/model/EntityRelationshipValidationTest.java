package com.examly.springapp.model;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.beans.factory.annotation.Autowired;

import com.examly.springapp.repository.EventRepository;
import com.examly.springapp.repository.StudentRepository;
import com.examly.springapp.repository.RegistrationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE) // prevent replacement with H2
public class EntityRelationshipValidationTest {
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private RegistrationRepository registrationRepository;

    @Test
    public void testCascadingAndValidation() {
        Student s = Student.builder().studentId("S99999").name("Checker").email("c@t.com").department("Dept").build();
        studentRepository.save(s);
        Event e = Event.builder().eventName("Valid EventName").description("Desc").date(LocalDate.now())
                .time("12:00 PM").venue("Auditorium").capacity(1)
                .category(EventCategory.CULTURAL).build();
        Event ev = eventRepository.save(e);

        Registration reg = Registration.builder().student(s).event(ev).registrationDate(LocalDateTime.now()).attended(false).build();
        registrationRepository.save(reg);

        List<Registration> regs = registrationRepository.findByStudent(s);
        assertFalse(regs.isEmpty());
        assertEquals(1, regs.size());
        assertEquals(s.getStudentId(), regs.get(0).getStudent().getStudentId());

        // On delete cascade
        registrationRepository.delete(reg);
        assertTrue(registrationRepository.findByStudent(s).isEmpty());
    }
}
