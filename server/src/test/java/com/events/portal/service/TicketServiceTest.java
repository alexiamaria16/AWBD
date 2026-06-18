package com.events.portal.service;

import com.events.portal.exception.BadRequestException;
import com.events.portal.exception.ResourceNotFoundException;
import com.events.portal.model.Event;
import com.events.portal.model.Ticket;
import com.events.portal.repository.TicketRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private EventService eventService;

    @InjectMocks
    private TicketService ticketService;

    private Ticket ticket;
    private Event event;

    @BeforeEach
    void setUp() {
        event = new Event();
        event.setId(1L);
        event.setAvailableSlots(10);

        ticket = new Ticket();
        ticket.setId(1L);
        ticket.setEvent(event);
    }

    @Test
    void getAllTickets_ShouldReturnPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Ticket> page = new PageImpl<>(Arrays.asList(ticket));
        when(ticketRepository.findAll(pageable)).thenReturn(page);

        Page<Ticket> result = ticketService.getAllTickets(pageable);

        assertEquals(1, result.getTotalElements());
        verify(ticketRepository, times(1)).findAll(pageable);
    }

    @Test
    void getTicketById_WhenFound_ShouldReturnTicket() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        Ticket result = ticketService.getTicketById(1L);

        assertEquals(1L, result.getId());
    }

    @Test
    void getTicketById_WhenNotFound_ShouldThrowException() {
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> ticketService.getTicketById(99L));
    }

    @Test
    void bookTicket_WhenSlotsAvailable_ShouldSaveAndReturn() {
        when(eventService.getEventById(1L)).thenReturn(event);
        when(ticketRepository.save(any(Ticket.class))).thenReturn(ticket);

        Ticket result = ticketService.bookTicket(ticket);

        assertNotNull(result);
        verify(eventService, times(1)).updateEvent(eq(1L), any(Event.class));
        verify(ticketRepository, times(1)).save(ticket);
        assertEquals(9, event.getAvailableSlots());
    }

    @Test
    void bookTicket_WhenNoSlots_ShouldThrowBadRequest() {
        event.setAvailableSlots(0);
        when(eventService.getEventById(1L)).thenReturn(event);

        assertThrows(BadRequestException.class, () -> ticketService.bookTicket(ticket));
        verify(ticketRepository, never()).save(any(Ticket.class));
    }

    @Test
    void deleteTicket_ShouldDelete() {
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        doNothing().when(ticketRepository).delete(ticket);

        ticketService.deleteTicket(1L);

        verify(ticketRepository, times(1)).delete(ticket);
    }
}
