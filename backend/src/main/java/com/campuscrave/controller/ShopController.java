package com.campuscrave.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/shop")
@CrossOrigin(origins = "*")
public class ShopController {

    @org.springframework.beans.factory.annotation.Autowired
    private com.campuscrave.repository.UserRepository userRepository;

    @GetMapping("/status")
    public Map<String, Boolean> getStatus(@RequestParam(required = false) String stallName) {
        if (stallName != null && !stallName.isEmpty()) {
            com.campuscrave.model.User shopOwner = userRepository.findByShopName(stallName);
            if (shopOwner != null) {
                return Map.of("isOpen", shopOwner.isOpen());
            }
        }
        // Fallback or global check (optional)
        return Map.of("isOpen", true);
    }

    @PostMapping("/toggle")
    public Map<String, Boolean> toggleStatus(@RequestBody Map<String, String> payload) {
        String stallName = payload.get("stallName");
        if (stallName != null) {
            com.campuscrave.model.User shopOwner = userRepository.findByShopName(stallName);
            if (shopOwner != null) {
                shopOwner.setOpen(!shopOwner.isOpen());
                userRepository.save(shopOwner);
                return Map.of("isOpen", shopOwner.isOpen());
            }
        }
        return Map.of("isOpen", false);
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.campuscrave.repository.MenuItemRepository menuItemRepository;

    @org.springframework.beans.factory.annotation.Autowired
    private com.campuscrave.repository.OrderRepository orderRepository;

    @GetMapping("/all-orders")
    public java.util.List<com.campuscrave.model.Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @GetMapping("/users")
    public java.util.List<com.campuscrave.model.User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/menu")
    public java.util.List<com.campuscrave.model.MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }
}
