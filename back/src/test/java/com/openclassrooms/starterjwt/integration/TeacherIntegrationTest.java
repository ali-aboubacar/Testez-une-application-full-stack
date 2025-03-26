package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import java.time.LocalDateTime;



@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class TeacherIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private TeacherRepository teacherRepository;

    private Teacher teacher;
    private Teacher teacher1;

    @BeforeEach
    void setup(){
        teacherRepository.deleteAll();
        LocalDateTime date = LocalDateTime.now();
        teacher = new Teacher(2L, "John1", "Doe1",date,date);
        teacher1 = new Teacher(3L, "John2", "Doe2",date,date);

        teacher = teacherRepository.save(teacher);
        teacher1 = teacherRepository.save(teacher1);

    }
    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldReturnTeacher() throws Exception{
        mockMvc.perform(get("/api/teacher/" + teacher.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(teacher.getId()))
                .andExpect(jsonPath("$.firstName").value("Doe1"))
                .andExpect(jsonPath("$.lastName").value("John1"));
    }

    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldReturnAllTeachers() throws Exception{
        mockMvc.perform(get("/api/teacher"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
