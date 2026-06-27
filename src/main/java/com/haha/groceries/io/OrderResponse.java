package com.haha.groceries.io;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderResponse {
    private String orderId;

    private String userId;
    private String userAddress;
    private String phoneNumber;
    private String email;
    private double amount;
    private String paymentStatus;
    private String razorpayOrderId;
    private String razorpaySignature;
    private String orderStatus;
}
