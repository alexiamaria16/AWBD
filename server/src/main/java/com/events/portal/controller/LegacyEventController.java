package com.events.portal.controller;

import com.events.portal.model.Event;
import com.events.portal.model.Ticket;
import com.events.portal.model.AppUser;
import com.events.portal.repository.EventRepository;
import com.events.portal.repository.TicketRepository;
import com.events.portal.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LegacyEventController {

    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final AppUserRepository appUserRepository;

    @GetMapping("/events")
    public ResponseEntity<?> index() {
        log.info("Fetching all events grouped by month (legacy format)");
        List<Event> events = eventRepository.findAll(Sort.by(Sort.Direction.ASC, "startDate"));
        return ResponseEntity.ok(buildGroupedEvents(events));
    }

    private List<Map<String, Object>> buildGroupedEvents(List<Event> events) {
        Map<String, Map<String, Object>> grouped = new LinkedHashMap<>();

        for (Event event : events) {
            String monthYear = event.getStartDate().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
            String code = event.getStartDate().format(DateTimeFormatter.ofPattern("yyyyMM"));

            grouped.putIfAbsent(monthYear, new HashMap<>(Map.of(
                    "label", monthYear,
                    "code", code,
                    "items", new ArrayList<Map<String, Object>>()
            )));

            List<Map<String, Object>> items = (List<Map<String, Object>>) grouped.get(monthYear).get("items");

            Map<String, Object> item = new HashMap<>();
            item.put("id", event.getId());
            item.put("name", event.getTitle());
            item.put("label", event.getTitle());
            item.put("description", event.getDescription());
            item.put("location", event.getLocation() != null ? event.getLocation() : "TBD");
            item.put("startDate", event.getStartDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a")));
            item.put("endDate", event.getEndDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy hh:mm a")));
            item.put("price", event.getPrice());
            item.put("capacity", event.getAvailableSlots());
            item.put("organizerName", event.getOrganizerName() != null ? event.getOrganizerName() : "Organizer");

            items.add(item);
        }

        return new ArrayList<>(grouped.values());
    }

    @GetMapping("/events/list")
    public ResponseEntity<?> listEvents() {
        DateTimeFormatter inputFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        List<Map<String, Object>> result = eventRepository.findAll(Sort.by(Sort.Direction.ASC, "title")).stream().map(event -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", event.getId());
            map.put("name", event.getTitle());
            map.put("description", event.getDescription());
            map.put("location", event.getLocation());
            map.put("startDate", event.getStartDate() != null ? event.getStartDate().format(inputFormat) : "");
            map.put("endDate", event.getEndDate() != null ? event.getEndDate().format(inputFormat) : "");
            map.put("price", event.getPrice());
            map.put("capacity", event.getAvailableSlots());
            map.put("organizerName", event.getOrganizerName());
            return map;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/events/register")
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Long> request) {
        Long eventId = request.get("event_id");
        Long userId = request.get("user_id");

        Optional<Event> optEvent = eventRepository.findById(eventId);
        Optional<AppUser> optUser = appUserRepository.findById(userId);

        if (optEvent.isEmpty() || optUser.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Event or User not found"));
        }

        Event event = optEvent.get();
        if (event.getAvailableSlots() <= 0) {
            return ResponseEntity.status(400).body(Map.of("message", "No more slots available for this event."));
        }

        Ticket ticket = new Ticket();
        ticket.setEvent(event);
        ticket.setBuyer(optUser.get());
        ticket.setCode(UUID.randomUUID().toString());
        ticket.setStatus("BOOKED");
        ticket.setPurchasedAt(java.time.LocalDateTime.now());

        event.setAvailableSlots(event.getAvailableSlots() - 1);
        eventRepository.save(event);
        ticketRepository.save(ticket);

        return ResponseEntity.ok(Map.of("message", "Successfully registered for the event"));
    }

    @PostMapping("/events/userEvents")
    public ResponseEntity<?> getUserEvents(@RequestBody Map<String, Long> request) {
        Long userId = request.get("user_id");
        Optional<AppUser> user = appUserRepository.findById(userId);
        if (user.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "User not found"));
        }

        List<Event> events = new ArrayList<>();
        Set<Long> seen = new HashSet<>();
        for (Ticket ticket : user.get().getTickets()) {
            Event event = ticket.getEvent();
            if (event != null && seen.add(event.getId())) {
                events.add(event);
            }
        }
        events.sort(Comparator.comparing(Event::getStartDate));

        return ResponseEntity.ok(buildGroupedEvents(events));
    }

    @PostMapping("/events/organizerEvents")
    public ResponseEntity<?> getOrganizerEvents(@RequestBody Map<String, Long> request) {
        return index();
    }

    @GetMapping("/events/participants")
    public ResponseEntity<?> getEventsWithParticipants(@RequestParam("user_id") Long userId) {
        List<Event> events = eventRepository.findAll();

        Map<Long, List<Ticket>> ticketsByEvent = ticketRepository.findAll().stream()
                .filter(t -> t.getEvent() != null)
                .collect(Collectors.groupingBy(t -> t.getEvent().getId()));

        List<Map<String, Object>> result = events.stream().map(event -> {
            List<Ticket> eventTickets = ticketsByEvent.getOrDefault(event.getId(), List.of());

            Map<Long, List<Ticket>> ticketsByBuyer = eventTickets.stream()
                    .filter(t -> t.getBuyer() != null)
                    .collect(Collectors.groupingBy(t -> t.getBuyer().getId(),
                            LinkedHashMap::new, Collectors.toList()));

            List<Map<String, Object>> participants = ticketsByBuyer.values().stream()
                    .map(buyerTickets -> {
                        AppUser buyer = buyerTickets.get(0).getBuyer();
                        Map<String, Object> p = new HashMap<>();
                        p.put("id", buyer.getId());
                        String fullName = buyer.getUserProfile() != null ? buyer.getUserProfile().getFullName() : null;
                        p.put("name", fullName != null && !fullName.isBlank() ? fullName : buyer.getUsername());
                        p.put("email", buyer.getEmail());
                        p.put("count", buyerTickets.size());
                        return p;
                    })
                    .collect(Collectors.toList());

            Map<String, Object> map = new HashMap<>();
            map.put("id", event.getId());
            map.put("name", event.getTitle());
            map.put("startDate", event.getStartDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")));
            map.put("capacity", event.getAvailableSlots() + eventTickets.size());
            map.put("registered_count", eventTickets.size());
            map.put("participants", participants);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/events/perDay")
    public ResponseEntity<?> getEventsPerDay() {
        List<Event> events = eventRepository.findAll();
        Map<String, Long> counts = events.stream().collect(Collectors.groupingBy(
                e -> e.getStartDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                Collectors.counting()
        ));

        return ResponseEntity.ok(Map.of("eventsPerDay", counts));
    }

    @PostMapping("/events")
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> body) {
        try {
            Event event = new Event();
            applyEventFields(event, body);
            Event saved = eventRepository.save(event);
            return ResponseEntity.status(201).body(Map.of(
                    "message", "Event created successfully",
                    "id", saved.getId()));
        } catch (Exception e) {
            log.error("Failed to create event", e);
            return ResponseEntity.status(400).body(Map.of("message", "Failed to create event: " + e.getMessage()));
        }
    }

    @PutMapping("/events")
    public ResponseEntity<?> updateEvent(@RequestBody Map<String, Object> body) {
        try {
            Long id = parseId(body.get("id"));
            if (id == null) {
                return ResponseEntity.status(400).body(Map.of("message", "Event ID is required"));
            }
            Optional<Event> opt = eventRepository.findById(id);
            if (opt.isEmpty()) {
                return ResponseEntity.status(404).body(Map.of("message", "Event not found"));
            }
            Event event = opt.get();
            applyEventFields(event, body);
            eventRepository.save(event);
            return ResponseEntity.ok(Map.of("message", "Event updated successfully"));
        } catch (Exception e) {
            log.error("Failed to update event", e);
            return ResponseEntity.status(400).body(Map.of("message", "Failed to update event: " + e.getMessage()));
        }
    }

    @DeleteMapping("/events")
    @Transactional
    public ResponseEntity<?> deleteEvent(@RequestBody Map<String, Object> body) {
        try {
            Long id = parseId(body.get("id"));
            if (id == null) {
                return ResponseEntity.status(400).body(Map.of("message", "Event ID is required"));
            }
            if (!eventRepository.existsById(id)) {
                return ResponseEntity.status(404).body(Map.of("message", "Event not found"));
            }
            List<Ticket> eventTickets = ticketRepository.findAll().stream()
                    .filter(t -> t.getEvent() != null && t.getEvent().getId().equals(id))
                    .collect(Collectors.toList());
            if (!eventTickets.isEmpty()) {
                ticketRepository.deleteAll(eventTickets);
            }
            eventRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Event deleted successfully"));
        } catch (Exception e) {
            log.error("Failed to delete event", e);
            return ResponseEntity.status(400).body(Map.of("message", "Failed to delete event: " + e.getMessage()));
        }
    }

    private void applyEventFields(Event event, Map<String, Object> body) {
        if (body.get("name") != null) {
            event.setTitle(body.get("name").toString());
        }
        if (body.get("description") != null) {
            event.setDescription(body.get("description").toString());
        }
        if (body.get("location") != null) {
            event.setLocation(body.get("location").toString());
        }
        if (body.get("organizerName") != null) {
            event.setOrganizerName(body.get("organizerName").toString());
        }
        if (notBlank(body.get("startDate"))) {
            event.setStartDate(java.time.LocalDateTime.parse(body.get("startDate").toString()));
        }
        if (notBlank(body.get("endDate"))) {
            event.setEndDate(java.time.LocalDateTime.parse(body.get("endDate").toString()));
        }
        if (notBlank(body.get("price"))) {
            event.setPrice(new java.math.BigDecimal(body.get("price").toString()));
        }
        if (notBlank(body.get("capacity"))) {
            event.setAvailableSlots(Integer.parseInt(body.get("capacity").toString()));
        }
    }

    private boolean notBlank(Object value) {
        return value != null && !value.toString().isBlank();
    }

    private Long parseId(Object idObj) {
        if (idObj == null || idObj.toString().isBlank()) {
            return null;
        }
        return Long.parseLong(idObj.toString());
    }
}
