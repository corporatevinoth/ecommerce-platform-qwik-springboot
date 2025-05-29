package com.ecommerce.order.service;

import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID; // For UUID
import java.math.BigDecimal; // <--- ADD THIS LINE


@Service
public class OrderService {

    private final OrderRepository orderRepository;

    @Autowired
    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Order placeOrder(UUID userId, List<OrderItem> items) {
        // Basic validation: ensure items are not empty
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item.");
        }

         // Calculate total amount using BigDecimal for precision
        BigDecimal totalAmount = items.stream()
                                     .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))) // Multiply price by quantity
                                     .reduce(BigDecimal.ZERO, BigDecimal::add); // Sum all item totals

        // Create new Order object
        Order order = new Order(userId, totalAmount, items);

        // Save the order and its items (due to CascadeType.ALL)
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(UUID id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + id));
    }

    // You could add methods here for:
    // - Updating order status
    // - Cancelling orders
    // - Integrating with a Product Service to check stock (future)
    // - Integrating with a Payment Service (future)
}