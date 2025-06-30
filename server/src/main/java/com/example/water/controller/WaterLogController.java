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

    // ✅ CREATE
    @PostMapping("/log")
    public ResponseEntity<String> logWater(@RequestBody Map<String, Object> body) {
        int amount = (int) body.get("amount");
        jdbc.update("INSERT INTO water_logs (amount, timestamp) VALUES (?, NOW())", amount);
        return ResponseEntity.ok("Water logged.");
    }

    // ✅ READ
    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        List<Map<String, Object>> logs = jdbc.queryForList("SELECT * FROM water_logs ORDER BY id DESC");
        return ResponseEntity.ok(logs);
    }

    // ✅ UPDATE
    @PutMapping("/log/{id}")
    public ResponseEntity<String> updateLog(@PathVariable int id, @RequestBody Map<String, Object> body) {
        int amount = (int) body.get("amount");
        jdbc.update("UPDATE water_logs SET amount = ? WHERE id = ?", amount, id);
        return ResponseEntity.ok("Water log updated.");
    }

    // ✅ DELETE
    @DeleteMapping("/log/{id}")
    public ResponseEntity<String> deleteLog(@PathVariable int id) {
        jdbc.update("DELETE FROM water_logs WHERE id = ?", id);
        return ResponseEntity.ok("Water log deleted.");
    }
}
