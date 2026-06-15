package com.events.portal.service;

import com.events.portal.exception.ResourceNotFoundException;
import com.events.portal.model.Event;
import com.events.portal.repository.EventRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    void getEventById_Success() {
        Event event = new Event();
        event.setId(1L);
        event.setTitle("Test Event");

        when(eventRepository.findById(1L)).thenReturn(Optional.of(event));

        Event found = eventService.getEventById(1L);
        assertNotNull(found);
        assertEquals("Test Event", found.getTitle());
    }

    @Test
    void getEventById_NotFound() {
        when(eventRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> eventService.getEventById(1L));
    }

    @Test
    void createEvent_Success() {
        Event event = new Event();
        event.setTitle("New Event");

        when(eventRepository.save(any(Event.class))).thenReturn(event);

        Event created = eventService.createEvent(event);
        assertNotNull(created);
        assertEquals("New Event", created.getTitle());
    }
}
