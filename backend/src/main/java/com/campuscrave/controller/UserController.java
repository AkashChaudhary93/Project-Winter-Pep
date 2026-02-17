package com.campuscrave.controller;

import com.campuscrave.model.User;
import com.campuscrave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (payload.containsKey("name"))
                user.setName(payload.get("name"));
            if (payload.containsKey("shopName"))
                user.setShopName(payload.get("shopName"));
            if (payload.containsKey("block"))
                user.setBlock(payload.get("block"));

            // Phone number usually isn't updated this way for security, but we can allow if
            // needed or keep it read-only for now.
            // if (payload.containsKey("phoneNumber"))
            // user.setPhoneNumber(payload.get("phoneNumber"));

            User updatedUser = userRepository.save(user);
            return Map.of("success", true, "user", updatedUser);
        } else {
            return Map.of("success", false, "message", "User not found");
        }
    }

    @GetMapping
    public java.util.List<User> getUsersByRoleAndBlock(@RequestParam String role, @RequestParam String block) {
        return userRepository.findByRoleAndBlockContainingIgnoreCase(role, block);
    }
}
