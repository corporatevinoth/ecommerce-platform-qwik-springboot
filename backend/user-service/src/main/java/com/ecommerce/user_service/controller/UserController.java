package com.ecommerce.user_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users") // A common mapping for user-related endpoints
public class UserController {

    @GetMapping("/status")
    public String getStatus() {
        return "User Service is UP!";
    }
}
