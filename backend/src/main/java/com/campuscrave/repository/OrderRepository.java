package com.campuscrave.repository;

import com.campuscrave.model.Order;
import com.campuscrave.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // Find all orders that are NOT completed (for the kitchen display)
    List<Order> findByStatusNot(OrderStatus status);

    // Find orders by student ID (for My Orders page)
    List<Order> findByStudentIdOrderByCreatedAtDesc(String studentId);

    // Find orders by MULTIPLE student IDs (Phone OR Reg Number)
    List<Order> findByStudentIdInOrderByCreatedAtDesc(List<String> studentIds);

    // Find completed or rejected orders (History)
    List<Order> findByStatusInOrderByCreatedAtDesc(List<OrderStatus> statuses);

    // Find active orders containing items from a specific stall (Case Insensitive)
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o JOIN o.items i JOIN i.menuItem m WHERE LOWER(m.stallName) = LOWER(:stallName) AND o.status IN :statuses ORDER BY o.createdAt DESC")
    List<Order> findByStallNameAndStatusIn(
            @org.springframework.data.repository.query.Param("stallName") String stallName,
            @org.springframework.data.repository.query.Param("statuses") List<OrderStatus> statuses);
}
