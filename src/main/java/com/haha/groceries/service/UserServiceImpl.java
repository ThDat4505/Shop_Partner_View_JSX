package com.haha.groceries.service;

import com.haha.groceries.entity.UserEntity;
import com.haha.groceries.io.UserRequest;
import com.haha.groceries.io.UserResponse;
import com.haha.groceries.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationFacade authenticationFacade;

    @Override
    public UserResponse registerUser(UserRequest request) {
        UserEntity newUser = convertToEntity(request);
        newUser = userRepository.save(newUser);
        return convertToResponse(newUser);
    }

    @Override
    public String findByUserId() {
        String loggedInUserEmail = authenticationFacade.getAuthentication().getName();
        UserEntity loggedInUser = userRepository.findByEmail(loggedInUserEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return loggedInUser.getUserId();
    }

    private UserEntity convertToEntity(UserRequest request) {
        return UserEntity.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
    }

    private UserResponse convertToResponse(UserEntity user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .email(user.getEmail()).
                build();
    }
}
