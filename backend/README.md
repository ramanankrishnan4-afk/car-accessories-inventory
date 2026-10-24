# Car Accessories Inventory Management System

A Java backend project using Spring Boot, Spring Data JPA, Hibernate, MySQL, and REST APIs.

## Requirements
- JDK 17 or newer
- Maven (or use Maven support in IntelliJ IDEA)
- MySQL Server

## Setup
1. Open this folder in IntelliJ IDEA as a Maven project.
2. In MySQL, run:
   ```sql
   CREATE DATABASE car_accessories_db;
   ```
3. Open `src/main/resources/application.properties`.
4. Set the database username and password. Replace `change_me` with your local MySQL password, or set `DB_USERNAME` and `DB_PASSWORD` environment variables.
5. Let Maven download dependencies.
6. Run `CarAccessoriesInventoryApplication.java`.
7. The API runs at `http://localhost:8080`.

## API endpoints
- `GET /api/accessories` - list all accessories
- `GET /api/accessories/1` - get one accessory
- `POST /api/accessories` - create an accessory
- `PUT /api/accessories/1` - update an accessory
- `DELETE /api/accessories/1` - delete an accessory
- `GET /api/accessories?category=Interior` - filter by category
- `GET /api/accessories?name=seat` - search name
- `GET /api/accessories?minPrice=100&maxPrice=5000` - filter by price range

## Sample POST body
Send this JSON to `POST /api/accessories` with `Content-Type: application/json`:
```json
{
  "name": "Seat Cover",
  "category": "Interior",
  "price": 2499.00,
  "stockQuantity": 15,
  "description": "Black seat cover set"
}
```

## Notes
- This starter project includes CRUD operations, basic validation, filtering, and database persistence.
- Authentication, automated tests, pagination, and a React frontend are not included yet.
- Do not claim features on your resume until you have run and tested them yourself.
