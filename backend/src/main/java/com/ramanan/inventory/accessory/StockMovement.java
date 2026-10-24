
package com.ramanan.inventory.accessory;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accessoryId;

    private String accessoryName;

    private String movementType;

    private int quantity;

    private int previousStock;

    private int newStock;

    private String note;

    private LocalDateTime movementDate;

    public StockMovement() {
    }

    public StockMovement(
            Long accessoryId,
            String accessoryName,
            String movementType,
            int quantity,
            int previousStock,
            int newStock,
            String note) {

        this.accessoryId = accessoryId;
        this.accessoryName = accessoryName;
        this.movementType = movementType;
        this.quantity = quantity;
        this.previousStock = previousStock;
        this.newStock = newStock;
        this.note = note;
        this.movementDate = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getAccessoryId() {
        return accessoryId;
    }

    public String getAccessoryName() {
        return accessoryName;
    }

    public String getMovementType() {
        return movementType;
    }

    public int getQuantity() {
        return quantity;
    }

    public int getPreviousStock() {
        return previousStock;
    }

    public int getNewStock() {
        return newStock;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getMovementDate() {
        return movementDate;
    }
}
