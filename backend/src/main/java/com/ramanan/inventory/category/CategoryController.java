
package com.ramanan.inventory.category;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5177"
})
@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    // Get all categories
    @GetMapping
    public List<Category> getAll() {
        return service.getAll();
    }

    // Get category by ID
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // Create a category
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Category create(@Valid @RequestBody Category category) {
        return service.create(category);
    }

    // Update a category
    @PutMapping("/{id}")
    public Category update(
            @PathVariable Long id,
            @Valid @RequestBody Category category) {

        return service.update(id, category);
    }

    // Delete a category
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
