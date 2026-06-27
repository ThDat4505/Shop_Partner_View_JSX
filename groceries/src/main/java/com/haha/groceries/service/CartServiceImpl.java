package com.haha.groceries.service;

import com.haha.groceries.entity.CartEntity;
import com.haha.groceries.io.CartRequest;
import com.haha.groceries.io.CartResponse;
import com.haha.groceries.repository.CartRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class CartServiceImpl implements CartService{

    private final CartRepository cartRepository;
    private final UserService userService;

    @Override
    public CartResponse addToCart(CartRequest request) {
        String loggedInUserId = userService.findByUserId();
        Optional<CartEntity> cartOptional = cartRepository.findByUserId(loggedInUserId);
        CartEntity cart = cartOptional.orElseGet(() -> new CartEntity(loggedInUserId, new HashMap<>()));
        Map<String, Integer> cartItems = cart.getItems();
        cartItems.put(request.getGoodId(), cartItems.getOrDefault(request.getGoodId(), 0) + 1);
        cart.setItems(cartItems);
        cart = cartRepository.save(cart);
        return convertToResponse(cart);
    }

    @Override
    public CartResponse getCart() {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElse(new CartEntity(null, loggedInUserId, new HashMap<>()));
        return convertToResponse(entity);
    }

    @Override
    public void clearCart() {
        String loggedInUserId = userService.findByUserId();
        cartRepository.deleteByUserId(loggedInUserId);
    }

    @Override
    public CartResponse removeFromCart(CartRequest cartRequest) {
        String loggedInUserId = userService.findByUserId();
        CartEntity entity = cartRepository.findByUserId(loggedInUserId)
                .orElseThrow(() -> new RuntimeException("Cart is not found"));
        Map<String, Integer> cartItems = entity.getItems();

        if (cartItems.containsKey(cartRequest.getGoodId())) {
            int currentQty = cartItems.get(cartRequest.getGoodId());

            if (currentQty > 0) {
                cartItems.put(cartRequest.getGoodId(), currentQty - 1);
            } else {
                cartItems.remove(cartRequest.getGoodId());
            }
            entity = cartRepository.save(entity);
        }
        return convertToResponse(entity);
    }

    private CartResponse convertToResponse(CartEntity cartEntity) {
        return CartResponse.builder()
                .cartId(cartEntity.getCartId())
                .userId(cartEntity.getUserId())
                .items(cartEntity.getItems())
                .build();
    }
}
