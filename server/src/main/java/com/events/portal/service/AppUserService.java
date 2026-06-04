package com.events.portal.service;

import com.events.portal.exception.ResourceNotFoundException;
import com.events.portal.model.AppUser;
import com.events.portal.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppUserService {
    private final AppUserRepository appUserRepository;

    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUserById(Long id) {
        return appUserRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public AppUser getUserByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    public AppUser createUser(AppUser user) {
        return appUserRepository.save(user);
    }

    public AppUser updateUser(Long id, AppUser userDetails) {
        AppUser user = getUserById(id);
        user.setEmail(userDetails.getEmail());
        user.setEnabled(userDetails.isEnabled());
        return appUserRepository.save(user);
    }

    public void deleteUser(Long id) {
        AppUser user = getUserById(id);
        appUserRepository.delete(user);
    }
}
