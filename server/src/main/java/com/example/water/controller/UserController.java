package com.example.water.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private JdbcTemplate jdbc;

    // Register user
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, Object> user) {
        String username = (String) user.get("username");
        String password = (String) user.get("password");

        Integer exists = jdbc.queryForObject("SELECT COUNT(*) FROM users WHERE username = ?", Integer.class, username);
        if (exists != null && exists > 0) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        jdbc.update("INSERT INTO users (username, password) VALUES (?, ?)", username, password);
        return ResponseEntity.ok("User registered successfully");
    }

    // Login user
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Map<String, Object> user) {
        String username = (String) user.get("username");
        String password = (String) user.get("password");

        Integer matched = jdbc.queryForObject(
            "SELECT COUNT(*) FROM users WHERE username = ? AND password = ?",
            Integer.class, username, password
        );

        if (matched != null && matched > 0) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
