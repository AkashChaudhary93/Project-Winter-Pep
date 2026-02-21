package com.campuscrave.controller;

import com.campuscrave.model.Order;
import com.campuscrave.model.OrderStatus;
import com.campuscrave.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import com.campuscrave.model.OrderItem;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private com.campuscrave.repository.MenuItemRepository menuItemRepository;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    // Rate an order
    @PostMapping("/{id}/rate")
    public Order rateOrder(@PathVariable Long id, @RequestBody java.util.Map<String, Object> ratingData) {
        Order order = orderRepository.findById(id).orElseThrow();

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new RuntimeException("Only completed orders can be rated");
        }

        Integer rating = (Integer) ratingData.get("rating");
        String review = (String) ratingData.get("review");

        order.setRating(rating);
        order.setReview(review);

        // Update stats for each menu item
        if (order.getItems() != null) {
            for (com.campuscrave.model.OrderItem orderItem : order.getItems()) {
                com.campuscrave.model.MenuItem menuItem = orderItem.getMenuItem();

                // Recalculate average
                double currentTotal = menuItem.getAverageRating() * menuItem.getTotalRatings();
                double newTotal = currentTotal + rating;
                int newCount = menuItem.getTotalRatings() + 1;

                menuItem.setAverageRating(newTotal / newCount);
                menuItem.setTotalRatings(newCount);

                menuItemRepository.save(menuItem);
            }
        }

        return orderRepository.save(order);
    }

    // Create a new order
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        System.out.println("Creating order for studentId: " + order.getStudentId());

        // We must set the order reference for each item so JPA knows the relationship
        if (order.getItems() != null) {
            order.getItems().forEach(item -> item.setOrder(order));
        }
        // Save cascades to items
        return orderRepository.save(order);
    }

    // Get live orders (Kitchen view)
    @GetMapping("/live")
    public List<Order> getLiveOrders(@RequestParam(required = false) String stallName) {
        List<OrderStatus> statuses = List.of(OrderStatus.PENDING, OrderStatus.ACCEPTED, OrderStatus.COOKING,
                OrderStatus.READY);

        if (stallName != null && !stallName.isEmpty()) {
            try {
                // Determine stall name safely
                String targetStall = stallName.trim();

                // Fetch ALL active orders and filter in memory to avoid JPQL issues
                List<Order> allActiveOrders = orderRepository.findByStatusInOrderByCreatedAtDesc(statuses);

                List<Order> filteredOrders = new java.util.ArrayList<>();

                for (Order order : allActiveOrders) {
                    // Check if this order contains items from our stall
                    boolean hasItemsFromStall = order.getItems().stream()
                            .anyMatch(i -> i.getMenuItem() != null
                                    && i.getMenuItem().getStallName() != null
                                    && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall));

                    if (hasItemsFromStall) {
                        // Detach to prevent DB updates
                        entityManager.detach(order);

                        List<com.campuscrave.model.OrderItem> stallItems = order.getItems().stream()
                                .filter(i -> i.getMenuItem() != null
                                        && i.getMenuItem().getStallName() != null
                                        && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall))
                                .collect(Collectors.toList());

                        // Replace list
                        order.setItems(new java.util.ArrayList<>(stallItems));

                        double newTotal = stallItems.stream()
                                .mapToDouble(i -> i.getMenuItem().getPrice() * i.getQuantity())
                                .sum();
                        order.setTotalAmount(newTotal);

                        filteredOrders.add(order);
                    }
                }
                return filteredOrders;
            } catch (Exception e) {
                System.err.println("ERROR in getLiveOrders: " + e.getMessage());
                e.printStackTrace();
                return new java.util.ArrayList<>();
            }
        }

        System.out.println("No stallName provided to /live. Returning empty list.");
        return new java.util.ArrayList<>();
    }

    // Get orders for a specific student (Search by Phone OR Reg Number)
    @GetMapping("/my-orders")
    public List<Order> getMyOrders(@RequestParam String studentId, @RequestParam(required = false) String altId) {
        System.out.println("Fetching orders for studentId: " + studentId + " or altId: " + altId);

        java.util.List<String> ids = new java.util.ArrayList<>();
        if (studentId != null && !studentId.isEmpty())
            ids.add(studentId);
        if (altId != null && !altId.isEmpty())
            ids.add(altId);

        if (ids.isEmpty())
            return java.util.List.of();

        List<Order> orders = orderRepository.findByStudentIdInOrderByCreatedAtDesc(ids);
        System.out.println("Found " + orders.size() + " orders");
        return orders;
    }

    // Get status of a specific order (Student Tracker)
    @GetMapping("/{id}")
    public Order getOrder(@PathVariable Long id) {
        return orderRepository.findById(id).orElseThrow();
    }

    // Update status (Kitchen action) — blocks direct COMPLETED transition
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow();

        // Block direct completion — must use verify-pickup endpoint
        if (status == OrderStatus.COMPLETED) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Use /verify-pickup endpoint to complete orders")
            );
        }

        order.setStatus(status);

        if (status == OrderStatus.ACCEPTED && order.getAcceptedAt() == null) {
            order.setAcceptedAt(java.time.LocalDateTime.now());
        } else if (status == OrderStatus.READY && order.getReadyAt() == null) {
            order.setReadyAt(java.time.LocalDateTime.now());
        }

        return ResponseEntity.ok(orderRepository.save(order));
    }

    // Verify pickup code and complete order
    @PostMapping("/{id}/verify-pickup")
    public ResponseEntity<?> verifyPickup(@PathVariable Long id, @RequestParam String code) {
        Order order = orderRepository.findById(id).orElseThrow();

        if (order.getStatus() != OrderStatus.READY) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Order is not ready for pickup")
            );
        }

        if (!order.getPickupCode().equals(code)) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Invalid pickup code")
            );
        }

        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(java.time.LocalDateTime.now());
        return ResponseEntity.ok(orderRepository.save(order));
    }

    // Get completed and rejected orders (History)
    @GetMapping("/history")
    public List<Order> getOrderHistory(@RequestParam(required = false) String stallName) {
        List<OrderStatus> statuses = List.of(OrderStatus.COMPLETED, OrderStatus.REJECTED);

        if (stallName != null && !stallName.isEmpty()) {
            try {
                // Determine stall name safely
                String targetStall = stallName.trim();

                // Fetch ALL history orders and filter in memory to avoid JPQL issues
                List<Order> allHistoryOrders = orderRepository.findByStatusInOrderByCreatedAtDesc(statuses);

                List<Order> filteredOrders = new java.util.ArrayList<>();

                for (Order order : allHistoryOrders) {
                    // Check if this order contains items from our stall
                    boolean hasItemsFromStall = order.getItems().stream()
                            .anyMatch(i -> i.getMenuItem() != null
                                    && i.getMenuItem().getStallName() != null
                                    && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall));

                    if (hasItemsFromStall) {
                        // Detach to prevent DB updates
                        entityManager.detach(order);

                        List<com.campuscrave.model.OrderItem> stallItems = order.getItems().stream()
                                .filter(i -> i.getMenuItem() != null
                                        && i.getMenuItem().getStallName() != null
                                        && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall))
                                .collect(Collectors.toList());

                        // Replace list
                        order.setItems(new java.util.ArrayList<>(stallItems));

                        double newTotal = stallItems.stream()
                                .mapToDouble(i -> i.getMenuItem().getPrice() * i.getQuantity())
                                .sum();
                        order.setTotalAmount(newTotal);

                        filteredOrders.add(order);
                    }
                }
                return filteredOrders;
            } catch (Exception e) {
                System.err.println("ERROR in getOrderHistory: " + e.getMessage());
                e.printStackTrace();
                return new java.util.ArrayList<>();
            }
        }

        return new java.util.ArrayList<>();
    }

    // Get estimated wait time
    @GetMapping("/wait-time")
    public java.util.Map<String, Object> getWaitTime() {
        // Count active orders (PENDING + COOKING)
        List<Order> activeOrders = orderRepository.findByStatusInOrderByCreatedAtDesc(
                List.of(OrderStatus.PENDING, OrderStatus.COOKING));

        int count = activeOrders.size();
        int estimatedMinutes = (count * 5) + 5; // 5 mins per order + 5 mins buffer

        String traffic = "Low";
        if (count > 5)
            traffic = "Moderate";
        if (count > 10)
            traffic = "Busy";

        return java.util.Map.of(
                "minutes", estimatedMinutes,
                "traffic", traffic,
                "activeOrders", count);
    }

    // Get analytics stats
    @GetMapping("/stats")
    public java.util.Map<String, Object> getOrderStats(@RequestParam(required = false) String stallName) {
        List<Order> completedOrders;
        List<OrderStatus> statuses = List.of(OrderStatus.COMPLETED);

        if (stallName != null && !stallName.isEmpty()) {
            try {
                String targetStall = stallName.trim();

                // Fetch ALL completed orders and filter in memory
                List<Order> allCompletedOrders = orderRepository.findByStatusInOrderByCreatedAtDesc(statuses);
                completedOrders = new java.util.ArrayList<>();

                for (Order order : allCompletedOrders) {
                    // Check if this order contains items from our stall
                    boolean hasItemsFromStall = order.getItems().stream()
                            .anyMatch(i -> i.getMenuItem() != null
                                    && i.getMenuItem().getStallName() != null
                                    && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall));

                    if (hasItemsFromStall) {
                        entityManager.detach(order);
                        List<com.campuscrave.model.OrderItem> stallItems = order.getItems().stream()
                                .filter(i -> i.getMenuItem() != null
                                        && i.getMenuItem().getStallName() != null
                                        && i.getMenuItem().getStallName().equalsIgnoreCase(targetStall))
                                .collect(Collectors.toList());

                        order.setItems(new java.util.ArrayList<>(stallItems));

                        double newTotal = stallItems.stream()
                                .mapToDouble(i -> i.getMenuItem().getPrice() * i.getQuantity())
                                .sum();
                        order.setTotalAmount(newTotal);

                        completedOrders.add(order);
                    }
                }
            } catch (Exception e) {
                System.err.println("ERROR in getOrderStats: " + e.getMessage());
                e.printStackTrace();
                completedOrders = new java.util.ArrayList<>();
            }

        } else {
            completedOrders = new java.util.ArrayList<>();
        }

        double totalRevenue = completedOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();

        int totalOrders = completedOrders.size();

        // Find top selling item
        java.util.Map<String, Integer> itemCounts = new java.util.HashMap<>();
        for (Order order : completedOrders) {
            for (com.campuscrave.model.OrderItem item : order.getItems()) {
                String name = item.getMenuItem().getName();
                itemCounts.put(name, itemCounts.getOrDefault(name, 0) + item.getQuantity());
            }
        }

        String topItem = itemCounts.entrySet().stream()
                .max(java.util.Map.Entry.comparingByValue())
                .map(java.util.Map.Entry::getKey)
                .orElse("N/A");

        return java.util.Map.of(
                "totalRevenue", totalRevenue,
                "totalOrders", totalOrders,
                "topItem", topItem);
    }
}
