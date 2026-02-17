package com.campuscrave.controller;

import com.campuscrave.model.User;
import com.campuscrave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // Mock OTP Storage (In-Memory)
    private Map<String, String> otpStorage = new HashMap<>();

    @PostMapping("/send-otp")
    public Map<String, String> sendOtp(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");

        // Generate a 4-digit OTP
        String otp = String.format("%04d", new Random().nextInt(10000));

        // Store it
        otpStorage.put(phoneNumber, otp);

        // Simulate SMS by printing to console
        System.out.println("==========================================");
        System.out.println("🔐 OTP for " + phoneNumber + " is: " + otp);
        System.out.println("==========================================");

        return Map.of("message", "OTP sent successfully");
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> payload) {
        String phoneNumber = payload.get("phoneNumber");
        String otp = payload.get("otp");
        String name = payload.get("name");

        // Student specific
        String registrationNumber = payload.get("registrationNumber");

        // Vendor specific
        String shopName = payload.get("shopName");
        String block = payload.get("block");

        // Role (default to STUDENT if not provided)
        String role = payload.getOrDefault("role", "STUDENT");

        if (otpStorage.containsKey(phoneNumber) && otpStorage.get(phoneNumber).equals(otp)) {
            // OTP Correct!
            otpStorage.remove(phoneNumber); // Clear OTP

            Optional<User> existingUser = userRepository.findByPhoneNumber(phoneNumber);

            if (existingUser.isPresent()) {
                User user = existingUser.get();
                // Check role mismatch (Optional security step)
                if (!user.getRole().equalsIgnoreCase(role)) {
                    return Map.of("success", false, "message",
                            "Account exists as " + user.getRole() + ". Please login to the correct app.");
                }
                return Map.of("success", true, "user", user);
            } else {
                // REGISTER
                if ("VENDOR".equalsIgnoreCase(role)) {
                    if (name != null && !name.isEmpty() && shopName != null && !shopName.isEmpty() && block != null
                            && !block.isEmpty()) {
                        // Create VENDOR
                        User newUser = new User(name, phoneNumber, null, "VENDOR", shopName, block);
                        return Map.of("success", true, "user", userRepository.save(newUser));
                    } else {
                        return Map.of("success", false, "message",
                                "Please complete your Vendor Profile (Shop Name & Block required).");
                    }
                } else {
                    // Create STUDENT
                    if (name != null && !name.isEmpty() && registrationNumber != null
                            && !registrationNumber.isEmpty()) {
                        User newUser = new User(name, phoneNumber, registrationNumber, "STUDENT", null, null);
                        return Map.of("success", true, "user", userRepository.save(newUser));
                    } else {
                        return Map.of("success", false, "message", "Account not found. Please Sign Up.");
                    }
                }
            }
        } else {
            return Map.of("success", false, "message", "Invalid OTP");
        }
    }
}
