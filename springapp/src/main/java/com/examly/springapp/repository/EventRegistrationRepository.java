package com.examly.springapp.repository;

import com.examly.springapp.model.EventRegistration;
import com.examly.springapp.model.User;
import com.examly.springapp.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    
    List<EventRegistration> findByUser(User user);
    
    List<EventRegistration> findByEvent(Event event);
    
    boolean existsByUserAndEvent(User user, Event event);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE DATE(er.registrationDate) = :date")
    Long countByRegistrationDate(@Param("date") java.time.LocalDate date);
    
    @Query("SELECT er FROM EventRegistration er ORDER BY er.registrationDate DESC LIMIT 10")
    List<EventRegistration> findTop10ByOrderByRegistrationDateDesc();
    
    @Query("SELECT MONTH(er.registrationDate) as month, COUNT(er) as count FROM EventRegistration er WHERE YEAR(er.registrationDate) = YEAR(CURRENT_DATE) GROUP BY MONTH(er.registrationDate) ORDER BY MONTH(er.registrationDate)")
    List<Map<String, Object>> getMonthlyRegistrationCounts();
    
    @Query("SELECT er FROM EventRegistration er WHERE er.user.username = :username")
    List<EventRegistration> findByUserUsername(@Param("username") String username);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.user.username = :username")
    Long countByUserUsername(@Param("username") String username);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.user.username = :username AND er.attended = true")
    Long countAttendedByUserUsername(@Param("username") String username);
    
    @Query("SELECT CASE WHEN COUNT(er) > 0 THEN true ELSE false END FROM EventRegistration er WHERE er.user.username = :username AND er.event.id = :eventId")
    boolean existsByUserUsernameAndEventId(@Param("username") String username, @Param("eventId") Long eventId);
    
    @Query("SELECT MONTH(er.registrationDate) as month, COUNT(er) as count FROM EventRegistration er WHERE er.registrationDate >= :startDate GROUP BY MONTH(er.registrationDate) ORDER BY MONTH(er.registrationDate)")
    List<Map<String, Object>> getMonthlyRegistrationCounts(@Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.event.eventId = :eventId")
    Long countByEventEventId(@Param("eventId") Long eventId);
    
    // New methods for studentId-based queries
    List<EventRegistration> findByStudentId(String studentId);
    
    @Query("SELECT CASE WHEN COUNT(er) > 0 THEN true ELSE false END FROM EventRegistration er WHERE er.studentId = :studentId AND er.event.id = :eventId")
    boolean existsByStudentIdAndEventId(@Param("studentId") String studentId, @Param("eventId") Long eventId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.studentId = :studentId")
    Long countByStudentId(@Param("studentId") String studentId);
    
    @Query("SELECT COUNT(er) FROM EventRegistration er WHERE er.studentId = :studentId AND er.attended = true")
    Long countAttendedByStudentId(@Param("studentId") String studentId);
}