const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/categories`;

// Get all categories
export async function getCategories() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return response.json();
}

// Create a category
export async function createCategory(category) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(category),
    });

    if (!response.ok) {
        throw new Error("Failed to create category");
    }

    return response.json();
}

// Update a category

export async function updateCategory(id, category) {
    const response = await fetch(API_URL + "/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            errorText || `Failed to update category: ${response.status}`
        );
    }

    return response.json();
}



// Delete a category

export async function deleteCategory(id) {
    const response = await fetch(API_URL + "/" + id, {
        method: "DELETE"
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            errorText || `Failed to delete category: ${response.status}`
        );
    }
}