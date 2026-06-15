package com.events.portal.controller;

import com.events.portal.model.Event;
import com.events.portal.repository.EventRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class LegacyEventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EventRepository eventRepository;

    @Test
    public void testIndex_ReturnsGroupedEvents() throws Exception {
        Event event = new Event();
        event.setId(10L);
        event.setTitle("Test Event");
        event.setStartDate(LocalDateTime.of(2026, 1, 15, 10, 0));
        event.setEndDate(LocalDateTime.of(2026, 1, 15, 12, 0));
        event.setPrice(java.math.BigDecimal.valueOf(50.0));
        event.setAvailableSlots(100);

        Mockito.when(eventRepository.findAll(any(Sort.class))).thenReturn(List.of(event));

        mockMvc.perform(get("/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].label").value("January 2026"))
                .andExpect(jsonPath("$[0].items[0].name").value("Test Event"));
    }
}
