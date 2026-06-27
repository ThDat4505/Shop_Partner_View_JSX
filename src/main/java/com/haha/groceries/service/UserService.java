package com.haha.groceries.service;

import com.haha.groceries.io.UserRequest;
import com.haha.groceries.io.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRequest request);

    String findByUserId();
}
