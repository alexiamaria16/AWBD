package com.events.portal.integration;

import com.events.portal.model.Category;
import com.events.portal.model.Event;
import com.events.portal.repository.CategoryRepository;
import com.events.portal.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class EventIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @BeforeEach
    void setup() {
        eventRepository.deleteAll();
        categoryRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ORGANIZER")
    void shouldCreateEvent() throws Exception {
        String eventJson = """
            {
                "title": "Integration Test Event",
                "description": "Desc",
                "startDate": "2026-10-10T10:00:00",
                "endDate": "2026-10-10T12:00:00",
                "price": 50.0,
                "availableSlots": 100
            }
        """;

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Integration Test Event")));
    }

    @Test
    void shouldGetAllEvents() throws Exception {
        Event event = new Event();
        event.setTitle("Test Title");
        event.setDescription("Test Desc");
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
        event.setPrice(BigDecimal.TEN);
        event.setAvailableSlots(10);
        eventRepository.save(event);

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Test Title")));
    }

    @Test
    void shouldRejectUnauthenticatedEventCreation() throws Exception {
        String eventJson = """
            {
                "title": "Should Not Be Created",
                "startDate": "2026-10-10T10:00:00",
                "endDate": "2026-10-10T12:00:00",
                "price": 50.0,
                "availableSlots": 100
            }
        """;

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldForbidNonOrganizerEventCreation() throws Exception {
        String eventJson = """
            {
                "title": "User Cannot Create",
                "startDate": "2026-10-10T10:00:00",
                "endDate": "2026-10-10T12:00:00",
                "price": 50.0,
                "availableSlots": 100
            }
        """;

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(eventJson))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldGetEventsWithCategoriesWithoutRecursion() throws Exception {
        Category cat = new Category();
        cat.setName("Music");
        cat.setDescription("Live music");
        Category savedCat = categoryRepository.save(cat);

        Event event = new Event();
        event.setTitle("Festival With Category");
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
        event.setPrice(BigDecimal.TEN);
        event.setAvailableSlots(50);
        event.getCategories().add(savedCat);
        eventRepository.save(event);

        mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title", is("Festival With Category")))
                .andExpect(jsonPath("$.content[0].categories[0].name", is("Music")));
    }

    @Test
    void shouldGetEventById() throws Exception {
        Event event = new Event();
        event.setTitle("Unique Event");
        event.setDescription("Desc");
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
        event.setPrice(BigDecimal.TEN);
        event.setAvailableSlots(5);
        Event savedEvent = eventRepository.save(event);

        mockMvc.perform(get("/api/events/" + savedEvent.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("Unique Event")));
    }
}
