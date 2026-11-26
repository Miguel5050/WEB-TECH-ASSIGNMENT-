package com.example.clinicoffices.office;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeRepository extends JpaRepository<Office, Long> {
    @Query("select o from Office o where upper(trim(o.roomNumber)) = upper(trim(:roomNumber))")
    List<Office> findMatchingRoomNumbers(@Param("roomNumber") String roomNumber);

    @Query("select count(o) from Office o where upper(trim(o.roomNumber)) = upper(trim(:roomNumber))")
    long countMatchingRoomNumbers(@Param("roomNumber") String roomNumber);

    @Query("select count(o) from Office o where upper(trim(o.roomNumber)) = upper(trim(:roomNumber)) and o.id <> :id")
    long countMatchingRoomNumbersForOtherOffice(
            @Param("roomNumber") String roomNumber,
            @Param("id") Long id
    );

    List<Office> findAllByAvailableTrueOrderByRoomNumberAsc();

    List<Office> findAllByOrderByRoomNumberAsc();

    Optional<Office> findFirstByOrderByActivityCountDescIdAsc();

    long countByAvailableTrue();
}
