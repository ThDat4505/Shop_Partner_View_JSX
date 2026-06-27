//package com.haha.groceries.service;
//
//import com.haha.groceries.entity.OrderEntity;
//import com.haha.groceries.io.OrderRequest;
//import com.haha.groceries.io.OrderResponse;
//import com.haha.groceries.repository.OrderRepository;
//import com.razorpay.Order;
//import com.razorpay.RazorpayClient;
//import lombok.AllArgsConstructor;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//
//@Service
//public class OrderServiceImpl implements OrderService{
//
//    private final OrderRepository orderRepository;
//    private final UserService userService;
//    private final String razorpayKey;
//    private final String razorpaySecret;
//
//    public OrderServiceImpl(
//            OrderRepository orderRepository,
//            UserService userService,
//            @Value("${razorpay_key}") String razorpayKey,
//            @Value("${razorpay_secret}") String razorpaySecret) {
//
//        this.orderRepository = orderRepository;
//        this.userService = userService;
//        this.razorpayKey = razorpayKey;
//        this.razorpaySecret = razorpaySecret;
//    }
//
//    @Override
//    public OrderResponse createOrderWithPayment(OrderRequest request) {
//        try {
//            OrderEntity newOrder = convertToEntity(request);
//            newOrder = orderRepository.save(newOrder);
//
//            // create razor payment order
//            RazorpayClient razorpayClient = new RazorpayClient(razorpayKey, razorpaySecret);
//            JSONObject orderRequest = new JSONObject();
//            orderRequest.put("amount", newOrder.getAmount());
//            orderRequest.put("currency", "EUR");
//            orderRequest.put("payment_capture", 1);
//
//            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
//            newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
//            String loggedInUserId = userService.findByUserId();
//            newOrder.setUserId(loggedInUserId);
//            newOrder = orderRepository.save(newOrder);
//            return convertToResponse(newOrder);
//        } catch (Exception e) {
//            throw new RuntimeException("Failed to create Razorpay Order");
//        }
//
//    }
//
//    private OrderResponse convertToResponse(OrderEntity newOrder) {
//        return OrderResponse.builder()
//                .orderId(newOrder.getOrderId())
//                .userId(newOrder.getUserId())
//                .userAddress(newOrder.getUserAddress())
//                .amount(newOrder.getAmount())
//                .paymentStatus(newOrder.getPaymentStatus())
//                .razorpayOrderId(newOrder.getRazorpayOrderId())
//                .orderStatus(newOrder.getOrderStatus())
//                .email(newOrder.getEmail())
//                .phoneNumber(newOrder.getPhoneNumber())
//                .build();
//    }
//
//    private OrderEntity convertToEntity(OrderRequest request) {
//        return OrderEntity.builder()
//                .userAddress(request.getUserAddress())
//                .amount(request.getAmount())
//                .orderedItems(request.getOrderedItems())
//                .email(request.getEmail())
//                .phoneNumber(request.getPhoneNumber())
//                .orderStatus(request.getOrderStatus())
//                .build();
//    }
//}
