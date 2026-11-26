package com.example.clinicoffices.office;

public record OfficeStats(
        long totalOffices,
        long availableOffices,
        long occupiedOffices,
        long recordedActivities,
        OfficeResponse busiestOffice
) {
}
