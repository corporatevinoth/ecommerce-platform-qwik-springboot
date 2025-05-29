package com.ecommerce.product.repository;

import com.ecommerce.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Marks this interface as a Spring Data JPA repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // JpaRepository provides CRUD methods automatically (save, findById, findAll, delete, etc.)
    // <Product, Long> means it's a repository for the Product entity with a Long primary key
}