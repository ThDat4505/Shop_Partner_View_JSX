//package com.haha.groceries.controller;
//
//import com.haha.groceries.io.OrderRequest;
//import com.haha.groceries.io.OrderResponse;
//import com.haha.groceries.service.OrderService;
//import com.razorpay.RazorpayException;
//import lombok.AllArgsConstructor;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/orders")
//@AllArgsConstructor
//public class OrderController {
//
//    private final OrderService orderService;
//
//    @PostMapping("/create")
//    public OrderResponse createOrderWithPayment(@RequestBody OrderRequest request) throws RazorpayException {
//        return orderService.createOrderWithPayment(request);
//    }
//}
