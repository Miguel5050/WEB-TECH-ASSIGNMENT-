package com.example.clinicoffices.office;

import java.util.List;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OfficeService {
    private final OfficeRepository officeRepository;

    public OfficeService(OfficeRepository officeRepository) {
        this.officeRepository = officeRepository;
    }

    public OfficeResponse create(OfficeInput input) {
        String roomNumber = normalizeRoomNumber(input.roomNumber());
        if (officeRepository.countMatchingRoomNumbers(roomNumber) > 0) {
            throw new RoomNumberConflictException("Room number is already registered");
        }

        Office office = new Office(input.name().trim(), roomNumber);
        return OfficeResponse.from(save(office));
    }

    @Transactional(readOnly = true)
    public List<OfficeResponse> findAll() {
        return officeRepository.findAllByOrderByRoomNumberAsc()
                .stream()
                .map(OfficeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<OfficeResponse> findAvailable() {
        return officeRepository.findAllByAvailableTrueOrderByRoomNumberAsc()
                .stream()
                .map(OfficeResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public OfficeResponse findById(Long id) {
        return OfficeResponse.from(getOffice(id));
    }

    @Transactional(readOnly = true)
    public OfficeResponse findBusiest() {
        return officeRepository.findFirstByOrderByActivityCountDescIdAsc()
                .map(OfficeResponse::from)
                .orElseThrow(() -> new OfficeNotFoundException("No offices have been registered"));
    }

    public OfficeStats getStats() {
        long total = officeRepository.count();
        long available = officeRepository.countByAvailableTrue();
        long activities = officeRepository.findAll()
                .stream()
                .mapToLong(Office::getActivityCount)
                .sum();
        OfficeResponse busiest = officeRepository.findFirstByOrderByActivityCountDescIdAsc()
                .map(OfficeResponse::from)
                .orElse(null);
        return new OfficeStats(total, available, total - available, activities, busiest);
    }

    public OfficeResponse update(Long id, OfficeInput input) {
        Office office = getOffice(id);
        String roomNumber = normalizeRoomNumber(input.roomNumber());
        if (officeRepository.countMatchingRoomNumbersForOtherOffice(roomNumber, id) > 0) {
            throw new RoomNumberConflictException("Room number is already registered");
        }

        office.updateDetails(input.name().trim(), roomNumber);
        return OfficeResponse.from(save(office));
    }

    public OfficeResponse setAvailability(Long id, AvailabilityInput input) {
        Office office = getOffice(id);
        office.setAvailable(input.available());
        return OfficeResponse.from(save(office));
    }

    public OfficeResponse recordActivity(Long id) {
        Office office = getOffice(id);
        office.recordActivity();
        return OfficeResponse.from(save(office));
    }

    public void deleteByRoomNumber(String rawRoomNumber) {
        String roomNumber = normalizeRoomNumber(rawRoomNumber);
        List<Office> matches = officeRepository.findMatchingRoomNumbers(roomNumber);
        if (matches.isEmpty()) {
            throw new OfficeNotFoundException("No office found for room number " + roomNumber);
        }
        officeRepository.deleteAll(matches);
    }

    private Office getOffice(Long id) {
        if (id == null || id < 1) {
            throw new IllegalArgumentException("Office ID must be a positive number");
        }
        return officeRepository.findById(id)
                .orElseThrow(() -> new OfficeNotFoundException("No office found with ID " + id));
    }

    private String normalizeRoomNumber(String rawRoomNumber) {
        if (rawRoomNumber == null || rawRoomNumber.isBlank()) {
            throw new IllegalArgumentException("Room number is required");
        }
        return rawRoomNumber.trim();
    }

    private Office save(Office office) {
        try {
            return officeRepository.saveAndFlush(office);
        } catch (DataIntegrityViolationException exception) {
            throw new RoomNumberConflictException("Room number is already registered");
        }
    }
}
