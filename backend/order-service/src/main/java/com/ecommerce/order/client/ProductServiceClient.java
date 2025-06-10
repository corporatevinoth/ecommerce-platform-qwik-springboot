package com.ecommerce.order.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class ProductServiceClient {

    private final WebClient webClient;

    public ProductServiceClient(WebClient.Builder webClientBuilder, 
                                @Value("${product.service.url}") String productServiceUrl) {
        this.webClient = webClientBuilder.baseUrl(productServiceUrl).build();
    }

    public Mono<String> getProductServiceStatus() {
        return webClient.get()
                    .uri("/api/products/status") // <--- CHANGED THIS LINE
                .retrieve()
                .bodyToMono(String.class);
    }
}