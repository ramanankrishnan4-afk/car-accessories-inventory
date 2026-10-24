
package com.ramanan.inventory.accessory;

import com.ramanan.inventory.accessory.StockMovement;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AccessoryService {

    private final AccessoryRepository repository;
    private final StockMovementRepository stockMovementRepository;

    public AccessoryService(
            AccessoryRepository repository,
            StockMovementRepository stockMovementRepository) {
        this.repository = repository;
        this.stockMovementRepository = stockMovementRepository;
    }

    public List<Accessory> getAll(
            String category,
            String name,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        if (minPrice != null && maxPrice != null) {
            if (minPrice.compareTo(maxPrice) > 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "minPrice cannot be greater than maxPrice");
            }

            return repository.findByPriceBetween(minPrice, maxPrice);
        }

        if (category != null && !category.isBlank()) {
            return repository.findByCategoryIgnoreCase(category);
        }

        if (name != null && !name.isBlank()) {
            return repository.findByNameContainingIgnoreCase(name);
        }

        return repository.findAll();
    }

    public Accessory getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Accessory not found with id " + id));
    }

    public Accessory create(Accessory accessory) {
        accessory.setId(null);
        return repository.save(accessory);
    }

    public Accessory update(Long id, Accessory updated) {
        Accessory existing = getById(id);

        existing.setName(updated.getName());
        existing.setCategory(updated.getCategory());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setDescription(updated.getDescription());

        return repository.save(existing);
    }

    public void delete(Long id) {
        Accessory existing = getById(id);
        repository.delete(existing);
    }

    @Transactional
    public Accessory adjustStock(
            Long id,
            StockAdjustmentRequest request) {

        Accessory accessory = getById(id);

        String movementType = request.getMovementType()
                .trim()
                .toUpperCase();

        int quantity = request.getQuantity();

        if (quantity <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity must be greater than zero");
        }

        int previousStock = accessory.getStockQuantity();
        int newStock;

        if ("ADD".equals(movementType)) {
            newStock = Math.addExact(previousStock, quantity);
        } else if ("REDUCE".equals(movementType)) {

            if (quantity > previousStock) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Insufficient stock. Available quantity: "
                                + previousStock);
            }

            newStock = previousStock - quantity;

        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Movement type must be ADD or REDUCE");
        }

        accessory.setStockQuantity(newStock);

        Accessory savedAccessory = repository.save(accessory);

        StockMovement movement = new StockMovement(
                savedAccessory.getId(),
                savedAccessory.getName(),
                movementType,
                quantity,
                previousStock,
                newStock,
                request.getNote()
        );

        stockMovementRepository.save(movement);

        return savedAccessory;
    }

    public List<StockMovement> getAllStockMovements() {
        return stockMovementRepository
                .findAllByOrderByMovementDateDesc();
    }

    public List<StockMovement> getStockMovementsByAccessory(Long id) {
        getById(id);

        return stockMovementRepository
                .findByAccessoryIdOrderByMovementDateDesc(id);
    }
}
