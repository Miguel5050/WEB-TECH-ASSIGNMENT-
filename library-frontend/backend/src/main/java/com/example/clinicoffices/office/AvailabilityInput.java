package com.example.clinicoffices.office;

import jakarta.validation.constraints.NotNull;

public record AvailabilityInput(@NotNull(message = "Availability is required") Boolean available) {
}
