package com.example.orderservice.service;

import com.example.orderservice.dto.OrderRequest;
import com.example.orderservice.dto.ProductDTO;
import com.example.orderservice.model.Order;
import com.example.orderservice.model.OrderItem;
import com.example.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import org.springframework.beans.factory.annotation.Value;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${product.service.url}")
    private String productServiceUrl;

    public Order placeOrder(OrderRequest orderRequest) {
        // 1. Call Product Service
        ProductDTO product = restTemplate.getForObject(productServiceUrl + orderRequest.getProductId(),
                ProductDTO.class);

        if (product == null) {
            throw new RuntimeException("Product not found");
        }

        // 2. Reduce Stock
        String reduceStockUrl = productServiceUrl + orderRequest.getProductId() + "/reduceStock?quantity="
                + orderRequest.getQuantity();
        try {
            restTemplate.put(reduceStockUrl, null);
        } catch (Exception e) {
            throw new RuntimeException("Failed to reduce stock or insufficient stock: " + e.getMessage());
        }

        // 3. Create Order
        Order order = new Order();
        OrderItem item = new OrderItem(product.getId(), product.getName(), orderRequest.getQuantity(),
                product.getPrice());
        order.setOrderItems(Collections.singletonList(item));
        order.setTotalAmount(product.getPrice() * orderRequest.getQuantity());

        // 3. Save Order
        Order savedOrder = orderRepository.save(order);

        // 4. Trigger Async Notification
        sendOrderConfirmation(savedOrder);

        return savedOrder;
    }

    @Async
    public void sendOrderConfirmation(Order order) {
        try {
            System.out.println("Starting background email task for Order ID: " + order.getId());
            Thread.sleep(3000); // Simulate delay
            System.out.println("Email sent for Order ID: " + order.getId());
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
