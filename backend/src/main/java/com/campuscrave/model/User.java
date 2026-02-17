package com.campuscrave.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users") // "user" is a reserved keyword in H2
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String phoneNumber;

    private String registrationNumber;

    private String role; // "STUDENT" or "VENDOR"

    private String shopName;
    private String block;

    @Column(name = "is_open")
    private Boolean isOpen = true; // Default to open

    public User() {
    }

    public User(String name, String phoneNumber, String registrationNumber, String role, String shopName,
            String block) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.registrationNumber = registrationNumber;
        this.role = role;
        this.shopName = shopName;
        this.block = block;
    }

    // Manual Getters and Setters (Lombok fallback)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getBlock() {
        return block;
    }

    public void setBlock(String block) {
        this.block = block;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("isOpen")
    public boolean isOpen() {
        return Boolean.TRUE.equals(isOpen);
    }

    public void setOpen(Boolean isOpen) {
        this.isOpen = isOpen;
    }
}
