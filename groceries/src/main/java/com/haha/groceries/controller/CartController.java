package com.haha.groceries.controller;

import com.haha.groceries.io.CartRequest;
import com.haha.groceries.io.CartResponse;
import com.haha.groceries.service.CartService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@AllArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping
    public CartResponse addToCart(@RequestBody CartRequest request) {
        String goodId = request.getGoodId();

        if (goodId == null || goodId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GoodId not found");
        }
        return cartService.addToCart(request);
    }

    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart() {
        cartService.clearCart();
    }

    @PostMapping("/remove")
    public CartResponse removeFromCart(@RequestBody CartRequest request) {
        String goodId = request.getGoodId();

        if (goodId == null || goodId.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "GoodId not found");
        }
        return cartService.removeFromCart(request);
    }
}
