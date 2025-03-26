package com.openclassrooms.starterjwt.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;



import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class SessionIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private SessionMapper sessionMapper;

    private ObjectMapper objectMapper = new ObjectMapper();

    private User user;
    private Teacher teacher;
    @BeforeEach
    void setup(){
        sessionRepository.deleteAll();
        user = new User(
                "test@email.com",
                "Doe",
                "John",
                "Password123",
                false
        );
        user = userRepository.save(user);
        LocalDateTime date = LocalDateTime.now();
        teacher = new Teacher(1L, "John", "Doe",date,date);
        teacher = teacherRepository.save(teacher);
    }

    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldCreateSession() throws Exception {
        SessionDto sessionDto = new SessionDto();
        sessionDto.setId(1L);
        sessionDto.setDate(new Date());
        sessionDto.setDescription("ceci est une description");
        sessionDto.setName("new session");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(user.getId()));

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("new session"));

        assertEquals(1, sessionRepository.count());
    }

    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldReturnListOfSession() throws Exception {
        Session session = new Session();
        session.setId(1L);
        session.setName("session 1");
        session.setDescription("this is a description");
        session.setDate(new Date());
        session.setUsers(Arrays.asList(user));
        sessionRepository.save(session);

        Session session1 = new Session();
        session1.setId(2L);
        session1.setName("session 2");
        session1.setDescription("this is a description");
        session1.setDate(new Date());
        session1.setUsers(Arrays.asList(user));
        sessionRepository.save(session1);


        mockMvc.perform(get("/api/session")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
    }
    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldReturnSessionWhenIdValid() throws Exception {
        Session session = new Session();
        session.setName("valid sessio");
        session.setDescription("this is a description");
        session.setDate(new Date());
        session = sessionRepository.save(session);

        mockMvc.perform(get("/api/session/" + session.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("valid sessio"));
    }

    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldReturnNotFoundWhenDoesntExists() throws Exception {
        mockMvc.perform(get("/api/session/99"))
                .andExpect(status().isNotFound());
    }




    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldDeleteSession()throws Exception{
        Session session = new Session();
        session.setName("valid sessio");
        session.setDescription("this is a description");
        session.setDate(new Date());
        session = sessionRepository.save(session);

        mockMvc.perform(delete("/api/session/" + session.getId()))
                .andExpect(status().isOk());

        assertFalse(sessionRepository.findById(session.getId()).isPresent());
    }

    @Test
    @WithMockUser(username = "AdminAdmin")
    void shouldUpdateTheSession()throws Exception{
        Session session = new Session();
        session.setName("old name");
        session.setDescription("old description");
        session.setDate(new Date());
        session.setTeacher(teacher);
        session = sessionRepository.save(session);

        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("new name");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("new description");
        sessionDto.setTeacher_id(teacher.getId());

        mockMvc.perform(put("/api/session/" + session.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("new name"))
                .andExpect(jsonPath("$.description").value("new description"));

        Session updatedSession = sessionRepository.findById(session.getId()).orElseThrow(() -> new NotFoundException());
        assertEquals("new name",updatedSession.getName());
    }
}
