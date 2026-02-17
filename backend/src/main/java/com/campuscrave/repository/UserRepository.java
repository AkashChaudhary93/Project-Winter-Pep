package com.campuscrave.repository;

import com.campuscrave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByPhoneNumber(String phoneNumber);

    @org.springframework.data.jpa.repository.Query("SELECT u FROM User u WHERE u.role = :role AND LOWER(u.block) LIKE LOWER(CONCAT('%', :block, '%'))")
    java.util.List<User> findByRoleAndBlockContainingIgnoreCase(@org.springframework.data.repository.query.Param("role") String role, @org.springframework.data.repository.query.Param("block") String block);

    User findByShopName(String shopName);
}
