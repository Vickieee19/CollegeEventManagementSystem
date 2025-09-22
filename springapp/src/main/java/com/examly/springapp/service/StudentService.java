package com.examly.springapp.service;

import com.examly.springapp.model.Student;
import com.examly.springapp.repository.StudentRepository;
import jakarta.validation.ValidationException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student getStudentById(String studentId) {
        Optional<Student> student = studentRepository.findById(studentId);
        return student.orElseThrow(() -> new ValidationException("Student not found"));
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsById(student.getStudentId())) {
            throw new ValidationException("Student already exists");
        }
        return studentRepository.save(student);
    }
}
