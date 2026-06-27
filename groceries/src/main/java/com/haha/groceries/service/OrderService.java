package com.haha.groceries.service;

import com.haha.groceries.io.OrderRequest;
import com.haha.groceries.io.OrderResponse;

public interface OrderService {
    OrderResponse createOrderWithPayment(OrderRequest request);
}
