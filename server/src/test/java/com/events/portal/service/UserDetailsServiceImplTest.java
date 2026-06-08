package com.events.portal.service;

import com.events.portal.model.AppUser;
import com.events.portal.model.Role;
import com.events.portal.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserDetailsServiceImplTest {

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        Role role = new Role();
        role.setName("ORGANIZER");
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        user = new AppUser();
        user.setUsername("org@events.com");
        user.setPassword("encoded-secret");
        user.setEnabled(true);
        user.setRoles(roles);
    }

    @Test
    void loadUserByUsername_WhenFound_ShouldReturnUserDetailsWithRole() {
        when(appUserRepository.findByUsername("org@events.com")).thenReturn(Optional.of(user));

        UserDetails details = userDetailsService.loadUserByUsername("org@events.com");

        assertEquals("org@events.com", details.getUsername());
        assertEquals("encoded-secret", details.getPassword());
        assertTrue(details.isEnabled());
        assertTrue(details.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ORGANIZER")));
    }

    @Test
    void loadUserByUsername_WhenNotFound_ShouldThrowException() {
        when(appUserRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("ghost"));
    }
}
