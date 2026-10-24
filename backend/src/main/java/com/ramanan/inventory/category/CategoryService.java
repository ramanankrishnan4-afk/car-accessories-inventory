
        package com.ramanan.inventory.category;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    // Get all categories
    public List<Category> getAll() {
        return repository.findAll();
    }

    // Get category by ID
    public Category getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Category not found with ID: " + id));
    }

    // Create category
    public Category create(Category category) {
        validateCategoryName(category.getName());

        if (repository.existsByNameIgnoreCase(category.getName().trim())) {
            throw new RuntimeException("Category name already exists");
        }

        category.setName(category.getName().trim());

        return repository.save(category);
    }

    // Update category
    public Category update(Long id, Category updatedCategory) {
        Category existingCategory = getById(id);

        validateCategoryName(updatedCategory.getName());

        String newName = updatedCategory.getName().trim();

        if (!existingCategory.getName().equalsIgnoreCase(newName)
                && repository.existsByNameIgnoreCase(newName)) {
            throw new RuntimeException("Category name already exists");
        }

        existingCategory.setName(newName);
        existingCategory.setDescription(updatedCategory.getDescription());

        return repository.save(existingCategory);
    }

    // Delete category
    public void delete(Long id) {
        Category category = getById(id);
        repository.delete(category);
    }

    // Validate category name
    private void validateCategoryName(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("Category name is required");
        }

        if (name.trim().length() > 60) {
            throw new IllegalArgumentException(
                    "Category name must be 60 characters or fewer");
        }
    }
}
