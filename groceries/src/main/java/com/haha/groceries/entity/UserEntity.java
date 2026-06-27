package com.haha.groceries.entity;

import com.haha.groceries.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class UserEntity {

    @Id
    private String userId;
    private String username;
    private String email;
    private String password;
    private Role role;

    // used when role = "STORE"
    private String storeName;
    private String storeAddress;
}
