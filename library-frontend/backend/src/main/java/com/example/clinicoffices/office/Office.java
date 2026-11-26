package com.example.clinicoffices.office;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "office")
public class Office {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "room_number", nullable = false, unique = true, length = 40)
    private String roomNumber;

    @Column(nullable = false)
    private boolean available = true;

    @Column(nullable = false)
    private long activityCount;

    protected Office() {
    }

    public Office(String name, String roomNumber) {
        this.name = name;
        this.roomNumber = roomNumber;
        this.available = true;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public boolean isAvailable() {
        return available;
    }

    public long getActivityCount() {
        return activityCount;
    }

    public void updateDetails(String name, String roomNumber) {
        this.name = name;
        this.roomNumber = roomNumber;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public void recordActivity() {
        this.activityCount++;
    }
}
