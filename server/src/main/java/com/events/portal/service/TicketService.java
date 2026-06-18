package com.events.portal.service;

import com.events.portal.exception.BadRequestException;
import com.events.portal.exception.ResourceNotFoundException;
import com.events.portal.model.Event;
import com.events.portal.model.Ticket;
import com.events.portal.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final EventService eventService;

    public Page<Ticket> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    @Transactional
    public Ticket bookTicket(Ticket ticket) {
        Event event = eventService.getEventById(ticket.getEvent().getId());
        
        if (event.getAvailableSlots() <= 0) {
            throw new BadRequestException("No available slots for this event.");
        }
        
        event.setAvailableSlots(event.getAvailableSlots() - 1);
        eventService.updateEvent(event.getId(), event);
        
        ticket.setCode(UUID.randomUUID().toString());
        ticket.setStatus("BOOKED");
        ticket.setPurchasedAt(LocalDateTime.now());
        
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = getTicketById(id);
        ticketRepository.delete(ticket);
    }
}
