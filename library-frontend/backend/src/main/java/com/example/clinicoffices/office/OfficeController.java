package com.example.clinicoffices.office;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/offices")
@CrossOrigin(origins = "http://localhost:5173")
public class OfficeController {
    private final OfficeService officeService;

    public OfficeController(OfficeService officeService) {
        this.officeService = officeService;
    }

    @PostMapping("/save")
    public ResponseEntity<OfficeResponse> create(@Valid @RequestBody OfficeInput input) {
        OfficeResponse created = officeService.create(input);
        return ResponseEntity.created(URI.create("/api/offices/" + created.id())).body(created);
    }

    @GetMapping
    public List<OfficeResponse> getAll() {
        return officeService.findAll();
    }

    @GetMapping("/free")
    public List<OfficeResponse> getAvailable() {
        return officeService.findAvailable();
    }

    @GetMapping("/busiest")
    public OfficeResponse getBusiest() {
        return officeService.findBusiest();
    }

    @GetMapping("/stats")
    public OfficeStats getStats() {
        return officeService.getStats();
    }

    @GetMapping("/{id}")
    public OfficeResponse getById(@PathVariable Long id) {
        return officeService.findById(id);
    }

    @PutMapping("/{id}")
    public OfficeResponse update(@PathVariable Long id, @Valid @RequestBody OfficeInput input) {
        return officeService.update(id, input);
    }

    @PatchMapping("/{id}/availability")
    public OfficeResponse setAvailability(
            @PathVariable Long id,
            @Valid @RequestBody AvailabilityInput input
    ) {
        return officeService.setAvailability(id, input);
    }

    @PostMapping("/{id}/activity")
    public OfficeResponse recordActivity(@PathVariable Long id) {
        return officeService.recordActivity(id);
    }

    @DeleteMapping("/room/{roomNumber}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteByRoomNumber(@PathVariable String roomNumber) {
        officeService.deleteByRoomNumber(roomNumber);
    }
}
