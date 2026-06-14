package com.events.portal.integration;

import com.events.portal.model.AppUser;
import com.events.portal.model.UserProfile;
import com.events.portal.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthRegistrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AppUserRepository appUserRepository;

    @BeforeEach
    void setup() {
        appUserRepository.deleteAll();
    }

    @Test
    void shouldPersistAllRegistrationFields() throws Exception {
        String body = """
            {
                "first_name": "Mary Jane",
                "last_name": "Watson",
                "email": "mary@events.com",
                "password": "password123",
                "phone_number": "0712345678",
                "country": "Romania",
                "city": "Cluj",
                "address": "Str. Exemplu 10",
                "postal_code": "400000"
            }
        """;

        mockMvc.perform(post("/userRegister")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.first_name", is("Mary Jane")))
                .andExpect(jsonPath("$.user.last_name", is("Watson")))
                .andExpect(jsonPath("$.user.phone_number", is("0712345678")))
                .andExpect(jsonPath("$.user.country", is("Romania")))
                .andExpect(jsonPath("$.user.city", is("Cluj")))
                .andExpect(jsonPath("$.user.address", is("Str. Exemplu 10")))
                .andExpect(jsonPath("$.user.postal_code", is("400000")));

        AppUser saved = appUserRepository.findByEmail("mary@events.com").orElseThrow();
        UserProfile profile = saved.getUserProfile();
        assertEquals("Mary Jane", profile.getFirstName());
        assertEquals("Watson", profile.getLastName());
        assertEquals("0712345678", profile.getPhone());
        assertEquals("Romania", profile.getCountry());
        assertEquals("Cluj", profile.getCity());
        assertEquals("Str. Exemplu 10", profile.getAddress());
        assertEquals("400000", profile.getPostalCode());
    }

    @Test
    void shouldHashPasswordWithBCryptAndAllowLogin() throws Exception {
        String body = """
            {
                "first_name": "Bob",
                "last_name": "Stone",
                "email": "bob@events.com",
                "password": "password123",
                "phone_number": "0700000001",
                "city": "Iasi"
            }
        """;

        mockMvc.perform(post("/userRegister")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated());

        AppUser saved = appUserRepository.findByEmail("bob@events.com").orElseThrow();
        assertTrue(saved.getPassword().startsWith("{bcrypt}$2a$"),
                "password should be BCrypt-hashed but was: " + saved.getPassword());
        assertNotEquals("password123", saved.getPassword());

        mockMvc.perform(post("/userLogin")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"email\": \"bob@events.com\", \"password\": \"password123\" }"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        mockMvc.perform(post("/userLogin")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{ \"email\": \"bob@events.com\", \"password\": \"wrongpass\" }"))
                .andExpect(status().isUnauthorized());
    }
}
