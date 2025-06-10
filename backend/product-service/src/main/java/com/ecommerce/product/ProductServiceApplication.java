package com.ecommerce.product;

import com.ecommerce.product.model.Product;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.ecommerce.product", "com.ecommerce.product.config"}) // Ensure config package is scanned
public class ProductServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProductServiceApplication.class, args);
	}

	// This CommandLineRunner will run after the application context is loaded
	@Bean
	public CommandLineRunner loadData(ProductRepository repository) {
		return (args) -> {
			// Check if products already exist to prevent duplicate entries on every restart
			if (repository.count() == 0) {
				System.out.println("Loading sample products...");
				repository.save(new Product(null, "Chocolate Fudge Cake", "Rich chocolate cake with fudge frosting", 25.99, 100));
				repository.save(new Product(null, "Vanilla Bean Cake", "Classic vanilla cake with creamy frosting", 22.50, 120));
				repository.save(new Product(null, "Strawberry Delight", "Fresh strawberry cake with real fruit", 28.00, 80));
				repository.save(new Product(null, "Custom Gift Box", "Assortment of gourmet treats", 35.00, 50));
				repository.save(new Product(null, "Anniversary Basket", "Elegant gift basket for couples", 40.00, 30));
				System.out.println("Sample products loaded.");
			} else {
				System.out.println("Products already exist, skipping data load.");
			}
		};
	}
}
