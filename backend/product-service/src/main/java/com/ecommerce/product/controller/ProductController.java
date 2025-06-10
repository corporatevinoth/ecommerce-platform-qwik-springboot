package com.ecommerce.product.controller;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController // Marks this class as a REST controller
@RequestMapping("/api/products") // Base path for all endpoints in this controller
public class ProductController {

    @Autowired // Injects the ProductRepository dependency
    private ProductRepository productRepository;

    // Endpoint to create a new product
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // Returns 201 Created status
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product); // Saves the product to the database
    }

    // Endpoint to get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll(); // Retrieves all products
    }

    // Endpoint to get a product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id); // Finds product by ID
        return product.map(ResponseEntity::ok) // If found, return 200 OK with product
                      .orElseGet(() -> ResponseEntity.notFound().build()); // Else return 404 Not Found
    }

    // Basic update endpoint (can be expanded later for partial updates)
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            Product existingProduct = optionalProduct.get();
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStockQuantity(productDetails.getStockQuantity());
            return ResponseEntity.ok(productRepository.save(existingProduct));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to delete a product by ID
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT) // Returns 204 No Content status
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/status")
    public String getStatus() {
        return "Product Service is UP!";
    }
}