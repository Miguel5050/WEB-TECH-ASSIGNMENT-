package com.example.clinicoffices.office;

public class RoomNumberConflictException extends RuntimeException {
    public RoomNumberConflictException(String message) {
        super(message);
    }
}
