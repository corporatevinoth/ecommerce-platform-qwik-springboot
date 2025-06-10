package com.ecommerce.order.controller;

import com.ecommerce.order.model.Order;
import com.ecommerce.order.model.OrderItem;
import com.ecommerce.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import com.ecommerce.order.dto.OrderRequest;
import com.ecommerce.order.dto.OrderItemRequest;

// --- New Imports for WebClient and Reactive Types ---
import com.ecommerce.order.client.ProductServiceClient;
import com.ecommerce.order.client.UserServiceClient;
import reactor.core.publisher.Mono;
import reactor.util.function.Tuple2;
// --- End New Imports ---

@RestController
@RequestMapping("/api/orders") // Keeping your original RequestMapping
public class OrderController {

    private final OrderService orderService;
    private final ProductServiceClient productServiceClient; // Declared the client fields
    private final UserServiceClient userServiceClient;     // Declared the client fields

    // Modified constructor to include new service clients for injection
    @Autowired
    public OrderController(OrderService orderService,
                           ProductServiceClient productServiceClient,
                           UserServiceClient userServiceClient) {
        this.orderService = orderService;
        this.productServiceClient = productServiceClient; // Initialized productServiceClient
        this.userServiceClient = userServiceClient;     // Initialized userServiceClient
    }

    @PostMapping
    public ResponseEntity<Order> placeOrder(@RequestBody OrderRequest orderRequest) {
        // In a real application, you'd perform more validation and potentially
        // interact with other services (e.g., Product Service to verify product details)

        // Convert OrderItemRequests to OrderItems
        List<OrderItem> orderItems = orderRequest.getItems().stream()
                .map(itemRequest -> new OrderItem(
                        itemRequest.getProductId(),
                        itemRequest.getProductName(),
                        itemRequest.getQuantity(),
                        itemRequest.getPrice()
                ))
                .toList();

        Order newOrder = orderService.placeOrder(orderRequest.getUserId(), orderItems);
        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable UUID id) {
        Order order = orderService.getOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/check-services")
    public Mono<String> checkServiceStatuses() {
        Mono<String> productServiceStatus = productServiceClient.getProductServiceStatus()
                .defaultIfEmpty("Product Service status: UNKNOWN or ERROR");
        Mono<String> userServiceStatus = userServiceClient.getUserServiceStatus()
                .defaultIfEmpty("User Service status: UNKNOWN or ERROR");

        return Mono.zip(productServiceStatus, userServiceStatus)
                   .map(tuple -> "Product Service: " + tuple.getT1() +
                                 ", User Service: " + tuple.getT2());
    }
}
