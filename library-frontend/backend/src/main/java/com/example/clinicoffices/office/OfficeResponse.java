package com.example.clinicoffices.office;

public record OfficeResponse(
        Long id,
        String name,
        String roomNumber,
        boolean available,
        long activityCount
) {
    public static OfficeResponse from(Office office) {
        return new OfficeResponse(
                office.getId(),
                office.getName(),
                office.getRoomNumber(),
                office.isAvailable(),
                office.getActivityCount()
        );
    }
}
