package com.events.portal.integration;

import com.events.portal.model.AppUser;
import com.events.portal.model.Event;
import com.events.portal.model.Role;
import com.events.portal.model.Ticket;
import com.events.portal.model.UserProfile;
import com.events.portal.repository.AppUserRepository;
import com.events.portal.repository.EventRepository;
import com.events.portal.repository.RoleRepository;
import com.events.portal.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TicketIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private TicketRepository ticketRepository;
    @Autowired
    private EventRepository eventRepository;
    @Autowired
    private AppUserRepository appUserRepository;
    @Autowired
    private RoleRepository roleRepository;

    @BeforeEach
    void setup() {
        ticketRepository.deleteAll();
        eventRepository.deleteAll();
        appUserRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "ORGANIZER")
    void shouldGetTicketsWithoutRecursionOrPasswordLeak() throws Exception {
        Role role = new Role();
        role.setName("USER");
        Role savedRole = roleRepository.save(role);

        AppUser buyer = new AppUser();
        buyer.setUsername("buyer@events.com");
        buyer.setEmail("buyer@events.com");
        buyer.setPassword("super-secret");
        buyer.setEnabled(true);
        Set<Role> roles = new HashSet<>();
        roles.add(savedRole);
        buyer.setRoles(roles);

        UserProfile profile = new UserProfile();
        profile.setFullName("Buyer One");
        profile.setCity("Bucharest");
        profile.setUser(buyer);
        buyer.setUserProfile(profile); // cascade ALL persists the profile

        AppUser savedBuyer = appUserRepository.save(buyer);

        Event event = new Event();
        event.setTitle("Concert");
        event.setStartDate(LocalDateTime.now().plusDays(1));
        event.setEndDate(LocalDateTime.now().plusDays(2));
        event.setPrice(BigDecimal.TEN);
        event.setAvailableSlots(10);
        Event savedEvent = eventRepository.save(event);

        Ticket ticket = new Ticket();
        ticket.setCode("TICKET-1");
        ticket.setStatus("BOOKED");
        ticket.setPurchasedAt(LocalDateTime.now());
        ticket.setEvent(savedEvent);
        ticket.setBuyer(savedBuyer);
        ticketRepository.save(ticket);

        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].event.title", is("Concert")))
                .andExpect(jsonPath("$.content[0].buyer.email", is("buyer@events.com")))
                .andExpect(jsonPath("$.content[0].buyer.password").doesNotExist());
    }
}
