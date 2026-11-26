package com.example.clinicoffices.office;

public class OfficeNotFoundException extends RuntimeException {
    public OfficeNotFoundException(String message) {
        super(message);
    }
}
