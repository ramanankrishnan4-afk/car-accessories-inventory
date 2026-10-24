package com.ramanan.inventory.accessory;

import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;

public interface AccessoryRepository extends JpaRepository<Accessory, Long> {
    List<Accessory> findByCategoryIgnoreCase(String category);
    List<Accessory> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Accessory> findByNameContainingIgnoreCase(String name);
}
