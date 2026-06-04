package com.events.portal.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrganizerRegisterRequest extends UserRegisterRequest {
    @NotBlank(message = "Invite code is required")
    @Size(min = 5, message = "Invite code must be at least 5 characters")
    private String invite_code;
}
