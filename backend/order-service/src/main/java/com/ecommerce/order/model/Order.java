package com.ecommerce.order.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID; // Import UUID for orderId generation
import java.math.BigDecimal; // <--- ADD THIS LINE


@Entity
@Table(name = "orders") // Renamed from 'order' to 'orders' to avoid SQL keyword conflict
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID) // Generate UUID for primary key
    private UUID id;

    @NotNull
    private UUID userId; // Assuming a userId from a future User Service

    @NotNull
    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    @NotNull
    private OrderStatus status;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id") // This column will be added to the OrderItem table
    private List<OrderItem> items = new ArrayList<>();

    @NotNull
    private BigDecimal totalAmount;

    // Default constructor for JPA
    public Order() {
        this.orderDate = LocalDateTime.now();
        this.status = OrderStatus.PENDING; // Default status
    }

    // Constructor for creating a new order
    public Order(UUID userId, BigDecimal totalAmount, List<OrderItem> items) {
        this(); // Call default constructor to set orderDate and status
        this.userId = userId;
        this.totalAmount = totalAmount;
        if (items != null) {
            this.items.addAll(items);
            // Set the order for each item if not already set (important for @JoinColumn)
            items.forEach(item -> item.setOrder(this));
        }
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    // Enum for Order Status
    public enum OrderStatus {
        PENDING,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", userId=" + userId +
                ", orderDate=" + orderDate +
                ", status=" + status +
                ", items=" + items +
                ", totalAmount=" + totalAmount +
                '}';
    }
}