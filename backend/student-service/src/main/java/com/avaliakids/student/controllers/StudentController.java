package com.avaliakids.student.controllers;

import com.avaliakids.student.models.Student;
import com.avaliakids.student.services.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(
        @RequestParam String name,
        @RequestParam String birthDate,
        @RequestParam String parentId
    ) {
        try {
            Student student = studentService.registerStudent(name, birthDate, parentId);
            return ResponseEntity.ok(student);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/by-parent/{parentId}")
    public ResponseEntity<List<Student>> getStudentsByParent(@PathVariable String parentId) {
        List<Student> students = studentService.getStudentsByParent(parentId);
        return ResponseEntity.ok(students);
    }
}
