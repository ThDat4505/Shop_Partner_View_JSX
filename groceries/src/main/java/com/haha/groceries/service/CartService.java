package com.haha.groceries.service;

import com.haha.groceries.io.CartRequest;
import com.haha.groceries.io.CartResponse;

public interface CartService {
    CartResponse addToCart(CartRequest request);

    CartResponse getCart();

    void clearCart();

    CartResponse removeFromCart(CartRequest cartRequest);
}
