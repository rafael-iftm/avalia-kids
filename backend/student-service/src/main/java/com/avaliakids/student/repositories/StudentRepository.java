package com.avaliakids.student.repositories;

import com.avaliakids.student.models.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StudentRepository extends MongoRepository<Student, String> {
    List<Student> findByParentId(String parentId);
}
