package com.ramanan.inventory.accessory;


import com.ramanan.inventory.accessory.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockMovementRepository
        extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findAllByOrderByMovementDateDesc();

    List<StockMovement> findByAccessoryIdOrderByMovementDateDesc(
            Long accessoryId);
}
