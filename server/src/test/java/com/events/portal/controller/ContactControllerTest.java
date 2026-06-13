package com.events.portal.controller;

import com.events.portal.model.ContactMessage;
import com.events.portal.repository.ContactMessageRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactMessageRepository contactMessageRepository;

    private ObjectMapper objectMapper = new ObjectMapper().registerModule(new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());

    @Test
    public void testStore_Success() throws Exception {
        ContactMessage msg = new ContactMessage();
        msg.setName("John Doe");
        msg.setEmail("john@example.com");
        msg.setMessage("Hello world!");

        ContactMessage saved = new ContactMessage();
        saved.setId(1L);
        saved.setName("John Doe");
        saved.setEmail("john@example.com");
        saved.setMessage("Hello world!");

        Mockito.when(contactMessageRepository.save(any(ContactMessage.class))).thenReturn(saved);

        mockMvc.perform(post("/contactRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(msg)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contact Data was sent successfully!"));
    }

    @Test
    public void testStore_ValidationError() throws Exception {
        ContactMessage msg = new ContactMessage();
        msg.setName("John Doe");
        msg.setEmail("john@example.com");
        mockMvc.perform(post("/contactRequest")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(msg)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Message is required"));
    }
}
