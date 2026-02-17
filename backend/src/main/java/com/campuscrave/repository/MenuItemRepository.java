package com.campuscrave.repository;

import com.campuscrave.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    // Custom query method to find available items
    List<MenuItem> findByIsAvailableTrue();

    // Find items by stall name (Case Insensitive)
    List<MenuItem> findByStallNameIgnoreCase(String stallName);
}
