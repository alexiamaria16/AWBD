package com.events.portal.controller;

import com.events.portal.security.JwtUtil;

import com.events.portal.dto.OrganizerRegisterRequest;
import com.events.portal.dto.UserLoginRequest;
import com.events.portal.dto.UserRegisterRequest;
import com.events.portal.model.AppUser;
import com.events.portal.model.Role;
import com.events.portal.model.UserProfile;
import com.events.portal.repository.AppUserRepository;
import com.events.portal.repository.RoleRepository;
import com.events.portal.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class LegacyAuthController {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final UserProfileRepository userProfileRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/userRegister")
    public ResponseEntity<?> userRegister(@Valid @RequestBody UserRegisterRequest request) {
        if (appUserRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(422).body(Map.of("status", "error", "message", "Email already registered"));
        }

        AppUser user = new AppUser();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        UserProfile profile = new UserProfile();
        profile.setFirstName(request.getFirst_name());
        profile.setLastName(request.getLast_name());
        profile.setFullName(request.getFirst_name() + " " + request.getLast_name());
        profile.setPhone(request.getPhone_number());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setAddress(request.getAddress());
        profile.setPostalCode(request.getPostal_code());
        profile.setUser(user);
        user.setUserProfile(profile);

        Role userRole = roleRepository.findByName("USER").orElseGet(() -> {
            Role r = new Role();
            r.setName("USER");
            return roleRepository.save(r);
        });
        user.getRoles().add(userRole);

        appUserRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), "USER");

        return ResponseEntity.status(201).body(Map.of(
                "status", "success",
                "message", "Registration successful! You are now an user.",
                "user", convertToUserDto(user),
                "token", token
        ));
    }

    @PostMapping("/organizerRegister")
    public ResponseEntity<?> organizerRegister(@Valid @RequestBody OrganizerRegisterRequest request) {
        if (!"ABC321".equals(request.getInvite_code())) {
            return ResponseEntity.status(422).body(Map.of("status", "error", "errors", Map.of("invite_code", "The invite code is invalid.")));
        }
        if (appUserRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(422).body(Map.of("status", "error", "message", "Email already registered"));
        }

        AppUser user = new AppUser();
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        UserProfile profile = new UserProfile();
        profile.setFirstName(request.getFirst_name());
        profile.setLastName(request.getLast_name());
        profile.setFullName(request.getFirst_name() + " " + request.getLast_name());
        profile.setPhone(request.getPhone_number());
        profile.setCity(request.getCity());
        profile.setCountry(request.getCountry());
        profile.setAddress(request.getAddress());
        profile.setPostalCode(request.getPostal_code());
        profile.setUser(user);
        user.setUserProfile(profile);

        Role orgRole = roleRepository.findByName("ORGANIZER").orElseGet(() -> {
            Role r = new Role();
            r.setName("ORGANIZER");
            return roleRepository.save(r);
        });
        user.getRoles().add(orgRole);

        appUserRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), "ORGANIZER");

        return ResponseEntity.status(201).body(Map.of(
                "status", "success",
                "message", "Registration successful! You are now an organizer.",
                "organizer", convertToUserDto(user),
                "token", token
        ));
    }

    @PostMapping("/userLogin")
    public ResponseEntity<?> userLogin(@Valid @RequestBody UserLoginRequest request) {
        return login(request, "USER");
    }

    @PostMapping("/organizerLogin")
    public ResponseEntity<?> organizerLogin(@Valid @RequestBody UserLoginRequest request) {
        return login(request, "ORGANIZER");
    }

    private ResponseEntity<?> login(UserLoginRequest request, String expectedRole) {
        log.info("Attempting login for {} as {}", request.getEmail(), expectedRole);
        Optional<AppUser> optUser = appUserRepository.findByEmail(request.getEmail());
        if (optUser.isEmpty()) {
            log.warn("Login failed: Account not found for {}", request.getEmail());
            return ResponseEntity.status(404).body(Map.of("status", "error", "message", "Account not found"));
        }

        AppUser user = optUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid password for {}", request.getEmail());
            return ResponseEntity.status(401).body(Map.of("status", "error", "message", "Invalid password"));
        }

        boolean hasRole = user.getRoles().stream().anyMatch(r -> r.getName().equals(expectedRole));
        if (!hasRole) {
            log.warn("Login failed: Missing role {} for {}", expectedRole, request.getEmail());
            return ResponseEntity.status(403).body(Map.of("status", "error", "message", "You do not have the necessary role to login here."));
        }

        String token = jwtUtil.generateToken(user.getEmail(), expectedRole);

        log.info("Login successful for {} as {}", request.getEmail(), expectedRole);
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Login successful",
                "user", convertToUserDto(user),
                "token", token
        ));
    }

    private Map<String, Object> convertToUserDto(AppUser user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        if (user.getUserProfile() != null) {
            UserProfile profile = user.getUserProfile();
            String firstName = profile.getFirstName();
            String lastName = profile.getLastName();
            if (firstName == null && profile.getFullName() != null) {
                String[] names = profile.getFullName().split(" ", 2);
                firstName = names[0];
                lastName = names.length > 1 ? names[1] : "";
            }
            map.put("first_name", firstName);
            map.put("last_name", lastName);
            map.put("phone_number", profile.getPhone());
            map.put("city", profile.getCity());
            map.put("country", profile.getCountry());
            map.put("address", profile.getAddress());
            map.put("postal_code", profile.getPostalCode());
        } else {
            map.put("first_name", user.getUsername());
        }
        map.put("email", user.getEmail());
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            map.put("role", user.getRoles().iterator().next().getName());
        }
        return map;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        return ResponseEntity.status(422).body(Map.of("status", "error", "message", errorMessage));
    }
}
