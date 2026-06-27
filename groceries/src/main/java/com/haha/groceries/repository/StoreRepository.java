package com.haha.groceries.repository;

import com.haha.groceries.entity.StoreEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoreRepository extends MongoRepository<StoreEntity, String> {
}
