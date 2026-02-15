package com.example.productservice.loader;

import com.example.productservice.model.Product;
import com.example.productservice.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            Product p1 = new Product("Whey Protein Gold", 59.99, 45);
            Product p2 = new Product("Mass Gainer 3XL", 69.99, 30);
            Product p3 = new Product("Serious Mass", 89.99, 25);
            Product p4 = new Product("Pre-Workout Energizer", 39.99, 50);
            Product p5 = new Product("BCAA Recovery", 34.99, 40);
            Product p6 = new Product("Creatine Monohydrate", 24.99, 60);

            productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6));
            System.out.println("Data Loaded: 6 Gym Products created.");
        }
    }
}
