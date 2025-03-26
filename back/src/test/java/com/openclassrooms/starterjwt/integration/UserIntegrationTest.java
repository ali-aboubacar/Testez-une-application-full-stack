package com.openclassrooms.starterjwt.integration;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
@ExtendWith(SpringExtension.class)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@ActiveProfiles("test")
public class UserIntegrationTest {
    @Autowired
    MockMvc mockMvc;
    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private User user;
    @BeforeEach
    void setup(){
         user = new User(
                "test@email.com",
                "Doe",
                "John",
                "Password123",
                false
        );
        user = userRepository.save(user);

    }
    @Test
    @WithMockUser(username = "JohnDoe")
    void shouldReturnOneUser() throws Exception {
        mockMvc.perform(get("/api/user/" + user.getId()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.email").value("test@email.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    @WithMockUser(username = "JohnDoe")
    void shouldReturnNotFound() throws Exception {
        mockMvc.perform(get("/api/user/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "JohnDoe")
    void shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/user/invalid"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "test@email.com")
    void shouldDeleteOneUser() throws Exception {
        mockMvc.perform(delete("/api/user/" + user.getId()))
                .andExpect(status().isOk());

        assertFalse(userRepository.existsById(user.getId()));
    }
}
