const API_URL = "http://localhost:8080/api/accessories";

// Handle API responses
async function handleResponse(response) {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            errorText || `
Request failed with status $ { response.status }
`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// Get all accessories
export async function getAll() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

// Get accessory by ID
export async function getById(id) {
    const response = await fetch(`
$ { API_URL }
/${id}`);
    return handleResponse(response);
}

// Create accessory
export async function create(accessory) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(accessory),
    });

    return handleResponse(response);
}

// Update accessory
export async function update(id, accessory) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(accessory),
    });

    return handleResponse(response);
}

// Delete accessory
export async function remove(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return handleResponse(response);
}

// Add or reduce stock
export async function adjustStock(id, adjustment) {
    const response = await fetch(`${API_URL}/${id}/stock`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(adjustment),
    });

    return handleResponse(response);
}

// Get all stock movements
export async function getMovements() {
    const response = await fetch(`${API_URL}/stock-movements`);
    return handleResponse(response);
}

// Get stock movements for one accessory
export async function getMovementsByAccessory(id) {
    const response = await fetch(
        `${API_URL}/stock-movements/${id}`
    );

    return handleResponse(response);
}