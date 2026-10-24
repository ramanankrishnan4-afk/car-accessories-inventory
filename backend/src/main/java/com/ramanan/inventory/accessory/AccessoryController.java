package com.ramanan.inventory.accessory;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.math.BigDecimal;
import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5177"
})
@RestController
@RequestMapping("/api/accessories")
public class AccessoryController {

    private final AccessoryService service;

    public AccessoryController(AccessoryService service) {
        this.service = service;
    }

    // Get all accessories
    @GetMapping
    public List<Accessory> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {

        return service.getAll(category, name, minPrice, maxPrice);
    }

    // Get accessory by ID
    @GetMapping("/{id}")
    public Accessory getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Create accessory
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Accessory create(@Valid @RequestBody Accessory accessory) {
        return service.create(accessory);
    }

    // Update accessory
    @PutMapping("/{id}")
    public Accessory update(
            @PathVariable Long id,
            @Valid @RequestBody Accessory accessory) {

        return service.update(id, accessory);
    }

    // Delete accessory
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // Add or reduce stock
    @PostMapping("/{id}/stock")
    public Accessory adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody StockAdjustmentRequest request) {

        return service.adjustStock(id, request);
    }

    // Get all stock movements
    @GetMapping("/stock-movements")
    public List<StockMovement> getAllStockMovements() {
        return service.getAllStockMovements();
    }

    // Get stock movements for one accessory
    @GetMapping("/stock-movements/{accessoryId}")
    public List<StockMovement> getStockMovementsByAccessory(
            @PathVariable Long accessoryId) {

        return service.getStockMovementsByAccessory(accessoryId);
    }
}