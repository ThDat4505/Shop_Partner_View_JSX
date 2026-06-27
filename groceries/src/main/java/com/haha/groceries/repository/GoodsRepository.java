package com.haha.groceries.repository;

import com.haha.groceries.entity.GoodsEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoodsRepository extends MongoRepository<GoodsEntity, String> {
    List<GoodsEntity> findByStoreId(String storeId);
}
