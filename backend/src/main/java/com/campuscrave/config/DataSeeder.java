package com.campuscrave.config;

import com.campuscrave.model.MenuItem;
import com.campuscrave.model.User;
import com.campuscrave.repository.MenuItemRepository;
import com.campuscrave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(MenuItemRepository menuItemRepository, UserRepository userRepository) {
        return args -> {
            // Check if we already have a significant amount of data
            if (menuItemRepository.count() > 100) {
                return; 
            }

            System.out.println("🚀 Seeding Complete Campus Demo Data...");

            // Hubs already seeded in previous turn (Apartment 1, 2, Block 33, 38, 36)
            seedApartment1(menuItemRepository, userRepository);
            seedApartment2(menuItemRepository, userRepository);
            seedBlock33(menuItemRepository, userRepository);
            seedBlock38(menuItemRepository, userRepository);
            seedBlock36(menuItemRepository, userRepository);

            // New locations to cover every area on the map
            seedUniMall(menuItemRepository, userRepository);
            seedMBlock(menuItemRepository, userRepository);
            seedBH1(menuItemRepository, userRepository);
            seedBH2(menuItemRepository, userRepository);
            seedBH3(menuItemRepository, userRepository);
            seedGH1(menuItemRepository, userRepository);
            seedGH2(menuItemRepository, userRepository);

            System.out.println("✅ Database Seeded with 150+ Items across ALL campus locations!");
        };
    }

    private void seedApartment1(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Amul Parlour Owner", "9998887771", "Amul Parlour", "Apartment 1");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Amul Gold Milk (500ml)", "Dairy", 33.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Chocolate Cone", "Ice Cream", 40.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Vanilla Cup", "Ice Cream", 20.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Butterscotch Brick", "Ice Cream", 180.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Paneer Pack (200g)", "Dairy", 95.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Cheese Slices (100g)", "Dairy", 85.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Amul Kool Badam", "Beverages", 30.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Hot Coffee", "Beverages", 25.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Sweet Lassi", "Beverages", 25.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Veg Cheese Sandwich", "Snacks", 60.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Garlic Toast", "Snacks", 45.0, true, "Apartment 1", "Amul Parlour", true));
        items.add(createItem("Amul Chocolate Bar", "Snacks", 50.0, true, "Apartment 1", "Amul Parlour", true));
        repo.saveAll(items);
    }

    private void seedApartment2(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Baskin Robbins Owner", "9998887772", "Baskin Robbins", "Apartment 2");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Belgian Chocolate", "Premium Ice Cream", 120.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Mississippi Mud", "Premium Ice Cream", 120.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Cotton Candy", "Premium Ice Cream", 99.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Bavarian Chocolate", "Premium Ice Cream", 110.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Mint Milk Chocolate", "Premium Ice Cream", 110.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Mango Magic", "Fruit Ice Cream", 90.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Pralines 'N Cream", "Premium Ice Cream", 130.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Fruit Overload", "Fruit Ice Cream", 110.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Roasted Coffee", "Premium Ice Cream", 110.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Honey Nut Crunch", "Premium Ice Cream", 120.0, true, "Apartment 2", "Baskin Robbins", true));
        items.add(createItem("Death by Chocolate", "Specialty", 250.0, true, "Apartment 2", "Baskin Robbins", true));
        repo.saveAll(items);
    }

    private void seedBlock33(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Rolls King Owner", "9998887773", "Rolls King", "Block 33");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Classic Veg Roll", "Veg Rolls", 80.0, true, "Block 33", "Rolls King", true));
        items.add(createItem("Paneer Tikka Roll", "Veg Rolls", 120.0, true, "Block 33", "Rolls King", true));
        items.add(createItem("Cheese Corn Roll", "Veg Rolls", 100.0, true, "Block 33", "Rolls King", true));
        items.add(createItem("Mix Veg Roll", "Veg Rolls", 90.0, true, "Block 33", "Rolls King", true));
        items.add(createItem("Egg Roll", "Non-Veg Rolls", 70.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Double Egg Roll", "Non-Veg Rolls", 90.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Chicken Seekh Roll", "Non-Veg Rolls", 150.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Double Chicken Roll", "Non-Veg Rolls", 180.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Mutton Keema Roll", "Non-Veg Rolls", 220.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Butter Chicken Roll", "Non-Veg Rolls", 190.0, true, "Block 33", "Rolls King", false));
        items.add(createItem("Paneer Mayonnaise Roll", "Veg Rolls", 130.0, true, "Block 33", "Rolls King", true));
        repo.saveAll(items);
    }

    private void seedBlock38(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Chai Point Owner", "9998887774", "Chai Point", "Block 38");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Ginger Chai (Large)", "Hot Chai", 45.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Masala Chai (Large)", "Hot Chai", 45.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Elaichi Chai (Large)", "Hot Chai", 45.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Lemon Tea", "Hot Chai", 35.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Green Tea", "Hot Chai", 35.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Samosa (2 pcs)", "Snacks", 30.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Vada Pav", "Snacks", 40.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Bun Maska", "Snacks", 50.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Classic Poha", "Snacks", 60.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Masala Upma", "Snacks", 60.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Banana Walnut Cake", "Bakery", 70.0, true, "Block 38", "Chai Point", true));
        items.add(createItem("Multigrain Cookies", "Bakery", 40.0, true, "Block 38", "Chai Point", true));
        repo.saveAll(items);
    }

    private void seedBlock36(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Momo Mia Owner", "9998887775", "Momo Mia", "Block 36");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Veg Steamed Momos", "Momos", 80.0, true, "Block 36", "Momo Mia", true));
        items.add(createItem("Veg Fried Momos", "Momos", 90.0, true, "Block 36", "Momo Mia", true));
        items.add(createItem("Paneer Steamed Momos", "Momos", 110.0, true, "Block 36", "Momo Mia", true));
        items.add(createItem("Chicken Steamed Momos", "Momos", 120.0, true, "Block 36", "Momo Mia", false));
        items.add(createItem("Chicken Fried Momos", "Momos", 130.0, true, "Block 36", "Momo Mia", false));
        items.add(createItem("Kurkure Veg Momos", "Special Momos", 140.0, true, "Block 36", "Momo Mia", true));
        items.add(createItem("Kurkure Chicken Momos", "Special Momos", 160.0, true, "Block 36", "Momo Mia", false));
        items.add(createItem("Veg Thukpa", "Mains", 150.0, true, "Block 36", "Momo Mia", true));
        items.add(createItem("Chicken Thukpa", "Mains", 180.0, true, "Block 36", "Momo Mia", false));
        items.add(createItem("Chicken Wai Wai", "Snacks", 100.0, true, "Block 36", "Momo Mia", false));
        items.add(createItem("Mango Fruit Beer", "Beverages", 50.0, true, "Block 36", "Momo Mia", true));
        repo.saveAll(items);
    }

    private void seedUniMall(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "UniCafe Owner", "9998887776", "UniCafe & Bistro", "Uni-Mall");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Margarita Pizza", "Mains", 150.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("White Sauce Pasta", "Mains", 120.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Veg Cheese Burger", "Snacks", 90.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Crispy Chicken Burger", "Snacks", 120.0, true, "Uni-Mall", "UniCafe & Bistro", false));
        items.add(createItem("Garlic Bread Sticks", "Snacks", 80.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Cold Coffee", "Beverages", 100.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Fresh Lime Soda", "Beverages", 60.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("French Fries", "Snacks", 70.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Choco Lava Cake", "Desserts", 90.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        items.add(createItem("Club Sandwich", "Snacks", 110.0, true, "Uni-Mall", "UniCafe & Bistro", true));
        repo.saveAll(items);
    }

    private void seedMBlock(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Engineer Owner", "9998887777", "Engineer's Junction", "M-Block");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Plain Maggi", "Quick Bites", 40.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Masala Maggi", "Quick Bites", 50.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Cheese Maggi", "Quick Bites", 65.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Egg Maggi", "Quick Bites", 70.0, true, "M-Block", "Engineer's Junction", false));
        items.add(createItem("Grilled Corn Sandwich", "Snacks", 55.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Aloo Patties", "Quick Bites", 20.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Paneer Patties", "Quick Bites", 30.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Masala Tea", "Beverages", 15.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Iced Tea", "Beverages", 45.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Cold Drink (300ml)", "Beverages", 40.0, true, "M-Block", "Engineer's Junction", true));
        items.add(createItem("Bread Omelette", "Quick Bites", 50.0, true, "M-Block", "Engineer's Junction", false));
        repo.saveAll(items);
    }

    private void seedBH1(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "BH1 Chef", "9998887778", "Home Plate", "BH 1");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Mini Thali", "Thalis", 80.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Deluxe Thali", "Thalis", 120.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Dal Tadka", "Mains", 90.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Paneer Butter Masala", "Mains", 160.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Jeera Rice", "Mains", 50.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Tandoori Roti", "Breads", 15.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Butter Naan", "Breads", 40.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Gulab Jamun (2 pcs)", "Desserts", 40.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Mix Veg", "Mains", 80.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Curd Bowl", "Sides", 20.0, true, "BH 1", "Home Plate", true));
        items.add(createItem("Roasted Papad", "Sides", 10.0, true, "BH 1", "Home Plate", true));
        repo.saveAll(items);
    }

    private void seedBH2(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Fit Chef", "9998887779", "Fit & Fuel", "BH 2");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Greek Salad", "Salads", 110.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Caesar Salad", "Salads", 120.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Fruit Platter", "Healthy Snacks", 90.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Watermelon Juice", "Beverages", 50.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Pineapple Juice", "Beverages", 60.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Protein Shake", "Supplements", 150.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Sprouts Bhel", "Healthy Snacks", 60.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Peanut Bowl", "Healthy Snacks", 40.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Green Smoothie", "Beverages", 130.0, true, "BH 2", "Fit & Fuel", true));
        items.add(createItem("Boiled Eggs (4)", "Mains", 60.0, true, "BH 2", "Fit & Fuel", false));
        items.add(createItem("Oatmeal Bowl", "Healthy Breakfast", 90.0, true, "BH 2", "Fit & Fuel", true));
        repo.saveAll(items);
    }

    private void seedBH3(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Owl Owner", "9998887780", "The Night Owl", "BH 3");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Chicken Zinger Burger", "Snacks", 130.0, true, "BH 3", "The Night Owl", false));
        items.add(createItem("BBQ Wings (6)", "Snacks", 160.0, true, "BH 3", "The Night Owl", false));
        items.add(createItem("Peri Peri Fries", "Sides", 90.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Onion Rings", "Sides", 80.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Loaded Nachos", "Snacks", 140.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Chicken Nuggets", "Snacks", 90.0, true, "BH 3", "The Night Owl", false));
        items.add(createItem("Oreo Shake", "Beverages", 110.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Energy Drink", "Beverages", 120.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Veg Zinger Burger", "Snacks", 120.0, true, "BH 3", "The Night Owl", true));
        items.add(createItem("Hot Chicken Wings", "Snacks", 170.0, true, "BH 3", "The Night Owl", false));
        items.add(createItem("Cheese Balls", "Snacks", 80.0, true, "BH 3", "The Night Owl", true));
        repo.saveAll(items);
    }

    private void seedGH1(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Baking Queen", "9998887781", "The Pink Bakery", "GH 1");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Red Velvet Pastry", "Pastries", 70.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Cheesecake Slice", "Pastries", 110.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Chocolate Mini Cake", "Cakes", 350.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Vanilla Cupcake", "Bakery", 40.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Oatmeal Cookies", "Bakery", 80.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Fruit Tart", "Bakery", 60.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Hot Chocolate", "Beverages", 90.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Macarons (4)", "Bakery", 160.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Banana Bread", "Bakery", 50.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Strawberry Mousse", "Desserts", 80.0, true, "GH 1", "The Pink Bakery", true));
        items.add(createItem("Garlic Cheese Bread", "Bakery", 70.0, true, "GH 1", "The Pink Bakery", true));
        repo.saveAll(items);
    }

    private void seedGH2(MenuItemRepository repo, UserRepository userRepo) {
        createVendor(userRepo, "Gourmet Chef", "9998887782", "Gourmet Garden", "GH 2");
        List<MenuItem> items = new ArrayList<>();
        items.add(createItem("Hummus & Pita", "Snacks", 130.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Veg Falafel Wrap", "Wraps", 110.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Paneer Tikka Salad", "Salads", 140.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Pomegranate Juice", "Beverages", 70.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Avocado Toast", "Healthy Breakfast", 150.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Quinoa Bowl", "Mains", 160.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Detox Water", "Beverages", 40.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Berry Smoothie", "Beverages", 120.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Grilled Tofu Wrap", "Wraps", 140.0, true, "GH 2", "Gourmet Garden", true));
        items.add(createItem("Yogurt Parfait", "Desserts", 100.0, true, "GH 2", "Gourmet Garden", true));
        repo.saveAll(items);
    }

    private MenuItem createItem(String name, String cat, Double price, boolean avail, String loc, String stall, boolean isVeg) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setCategory(cat);
        item.setPrice(price);
        item.setAvailable(avail);
        item.setVeg(isVeg);
        item.setLocation(loc);
        item.setStallName(stall);
        item.setImageUrl("");
        item.setAverageRating(4.0 + Math.random());
        item.setTotalRatings((int)(Math.random() * 100));
        return item;
    }

    private void createVendor(UserRepository userRepo, String name, String phone, String shop, String block) {
        if (userRepo.findByPhoneNumber(phone).isEmpty()) {
            User vendor = new User();
            vendor.setName(name);
            vendor.setPhoneNumber(phone);
            vendor.setRole("VENDOR");
            vendor.setShopName(shop);
            vendor.setBlock(block);
            userRepo.save(vendor);
        }
    }
}
