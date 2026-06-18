package com.events.portal.controller;

import com.events.portal.model.ContactMessage;
import com.events.portal.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import jakarta.validation.Valid;

import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    @PostMapping("/contactRequest")
    public ResponseEntity<Map<String, String>> store(@Valid @RequestBody ContactMessage request) {
        log.info("Received contact request from: {}", request.getEmail());

        ContactMessage savedMessage = contactMessageRepository.save(request);
        log.info("Saved contact message with ID: {}", savedMessage.getId());

        return ResponseEntity.ok(Map.of("message", "Contact Data was sent successfully!"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        log.warn("Validation failed for contact request: {}", errorMessage);
        return ResponseEntity.badRequest().body(Map.of("message", errorMessage));
    }
}
