package com.example.clinicoffices.office;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record OfficeInput(
        @NotBlank(message = "Office name is required")
        @Size(max = 100, message = "Office name must be 100 characters or fewer")
        String name,
        @NotBlank(message = "Room number is required")
        @Size(max = 40, message = "Room number must be 40 characters or fewer")
        String roomNumber
) {
}
