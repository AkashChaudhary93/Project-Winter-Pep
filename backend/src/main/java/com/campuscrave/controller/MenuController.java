package com.campuscrave.controller;

import com.campuscrave.model.MenuItem;
import com.campuscrave.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu")
@CrossOrigin(origins = "*")
public class MenuController {

    @Autowired
    private MenuItemRepository menuItemRepository;

    // Get all items (optional filter by stallName)
    @GetMapping
    public List<MenuItem> getAllMenu(@RequestParam(required = false) String stallName) {
        if (stallName != null && !stallName.isEmpty()) {
            return menuItemRepository.findByStallNameIgnoreCase(stallName);
        }
        return menuItemRepository.findAll();
    }

    // Toggle stock availability
    @PutMapping("/{id}/toggle-stock")
    public MenuItem toggleStock(@PathVariable Long id) {
        MenuItem item = menuItemRepository.findById(id).orElseThrow();
        item.setAvailable(!item.isAvailable());
        return menuItemRepository.save(item);
    }

    // Add new menu item
    @PostMapping
    public MenuItem addMenuItem(@RequestBody MenuItem item) {
        return menuItemRepository.save(item);
    }

    // Delete menu item
    @DeleteMapping("/{id}")
    public void deleteMenuItem(@PathVariable Long id) {
        menuItemRepository.deleteById(id);
    }
}
