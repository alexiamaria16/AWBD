package com.events.portal.controller;

import com.events.portal.dto.UserRegisterRequest;
import com.events.portal.model.AppUser;
import com.events.portal.model.Role;
import com.events.portal.repository.AppUserRepository;
import com.events.portal.repository.RoleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class LegacyAuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AppUserRepository appUserRepository;

    @MockBean
    private RoleRepository roleRepository;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void testUserRegister_Success() throws Exception {
        UserRegisterRequest req = new UserRegisterRequest();
        req.setFirst_name("Alice");
        req.setLast_name("Smith");
        req.setEmail("alice@example.com");
        req.setPassword("password123");

        Mockito.when(appUserRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        
        Role role = new Role();
        role.setId(1L);
        role.setName("USER");
        Mockito.when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));

        mockMvc.perform(post("/userRegister")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"));
    }
}
