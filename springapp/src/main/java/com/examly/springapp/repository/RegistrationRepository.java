package com.examly.springapp.repository;

import com.examly.springapp.model.Registration;
import com.examly.springapp.model.Student;
import com.examly.springapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    
    List<Registration> findByEvent_EventId(Long eventId);
    
    List<Registration> findByStudent_StudentId(String studentId);
    
    List<Registration> findByStudent(Student student);
    
    List<Registration> findByEvent(Event event);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.event.eventId = ?1")
    Long countByEventId(Long eventId);
    
    @Query("SELECT COUNT(DISTINCT r.student.studentId) FROM Registration r")
    Long countUniqueStudents();
    
    boolean existsByEvent_EventIdAndStudent_StudentId(Long eventId, String studentId);
}