package com.events.portal.service;

import com.events.portal.exception.ResourceNotFoundException;
import com.events.portal.model.AppUser;
import com.events.portal.repository.AppUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @InjectMocks
    private AppUserService appUserService;

    private AppUser user;

    @BeforeEach
    void setUp() {
        user = new AppUser();
        user.setId(1L);
        user.setUsername("alice@events.com");
        user.setEmail("alice@events.com");
        user.setPassword("secret");
        user.setEnabled(true);
    }

    @Test
    void getAllUsers_ShouldReturnList() {
        when(appUserRepository.findAll()).thenReturn(Arrays.asList(user));

        List<AppUser> result = appUserService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("alice@events.com", result.get(0).getUsername());
        verify(appUserRepository, times(1)).findAll();
    }

    @Test
    void getUserById_WhenFound_ShouldReturnUser() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));

        AppUser result = appUserService.getUserById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(appUserRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_WhenNotFound_ShouldThrowException() {
        when(appUserRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> appUserService.getUserById(99L));
    }

    @Test
    void getUserByUsername_WhenFound_ShouldReturnUser() {
        when(appUserRepository.findByUsername("alice@events.com")).thenReturn(Optional.of(user));

        AppUser result = appUserService.getUserByUsername("alice@events.com");

        assertEquals("alice@events.com", result.getEmail());
        verify(appUserRepository, times(1)).findByUsername("alice@events.com");
    }

    @Test
    void getUserByUsername_WhenNotFound_ShouldThrowException() {
        when(appUserRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> appUserService.getUserByUsername("ghost"));
    }

    @Test
    void createUser_ShouldSaveAndReturn() {
        when(appUserRepository.save(any(AppUser.class))).thenReturn(user);

        AppUser result = appUserService.createUser(user);

        assertNotNull(result);
        assertEquals("alice@events.com", result.getUsername());
        verify(appUserRepository, times(1)).save(user);
    }

    @Test
    void updateUser_ShouldUpdateEmailAndEnabled() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        when(appUserRepository.save(any(AppUser.class))).thenReturn(user);

        AppUser updateDetails = new AppUser();
        updateDetails.setEmail("new@events.com");
        updateDetails.setEnabled(false);

        AppUser result = appUserService.updateUser(1L, updateDetails);

        assertEquals("new@events.com", result.getEmail());
        assertFalse(result.isEnabled());
        verify(appUserRepository, times(1)).save(user);
    }

    @Test
    void deleteUser_ShouldDelete() {
        when(appUserRepository.findById(1L)).thenReturn(Optional.of(user));
        doNothing().when(appUserRepository).delete(user);

        appUserService.deleteUser(1L);

        verify(appUserRepository, times(1)).delete(user);
    }
}
