package com.ecommerce.order.repository;

import com.ecommerce.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    // Spring Data JPA will automatically provide basic CRUD operations
    // You can add custom query methods here if needed, e.g., findByUserId
}