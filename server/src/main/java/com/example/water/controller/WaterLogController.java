package com.example.water.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reminder")
@CrossOrigin(origins = "http://localhost:3000")
public class WaterLogController {

    @Autowired
    private JdbcTemplate jdbc;

    // Create new water log with username
    @PostMapping("/log")
    public ResponseEntity<String> logWater(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        Integer amount = (Integer) body.get("amount");
        if (username == null || amount == null) {
            return ResponseEntity.badRequest().body("Missing username or amount");
        }

        jdbc.update("INSERT INTO water_logs (username, amount, timestamp) VALUES (?, ?, NOW())", username, amount);
        return ResponseEntity.ok("Water logged.");
    }

    // Read all water logs for a given user
    @GetMapping("/logs/{username}")
    public ResponseEntity<List<Map<String, Object>>> getLogs(@PathVariable String username) {
        List<Map<String, Object>> logs = jdbc.queryForList(
            "SELECT * FROM water_logs WHERE username = ? ORDER BY id DESC", username);
        return ResponseEntity.ok(logs);
    }

    // Update a water log by id
    @PutMapping("/log/{id}")
    public ResponseEntity<String> updateLog(@PathVariable int id, @RequestBody Map<String, Object> body) {
        Integer amount = (Integer) body.get("amount");
        if (amount == null) {
            return ResponseEntity.badRequest().body("Missing amount");
        }
        jdbc.update("UPDATE water_logs SET amount = ? WHERE id = ?", amount, id);
        return ResponseEntity.ok("Water log updated.");
    }

    // Delete a water log by id
    @DeleteMapping("/log/{id}")
    public ResponseEntity<String> deleteLog(@PathVariable int id) {
        jdbc.update("DELETE FROM water_logs WHERE id = ?", id);
        return ResponseEntity.ok("Water log deleted.");
    }
}
