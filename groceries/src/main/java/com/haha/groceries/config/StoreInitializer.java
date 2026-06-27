//package com.haha.groceries.config;
//
//import com.haha.groceries.entity.StoreEntity;
//import com.haha.groceries.repository.StoreRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//
//@Component
//@RequiredArgsConstructor
//public class StoreInitializer implements CommandLineRunner {
//    private final StoreRepository storeRepository;
//
//    @Override
//    public void run(String... args) {
//        StoreEntity bigBasket = new StoreEntity();
//        bigBasket.setStoreId("1234");
//        bigBasket.setStoreName("Big Basket");
//        storeRepository.save(bigBasket);
//
//        StoreEntity rewe = new StoreEntity();
//        rewe.setStoreId("5678");
//        rewe.setStoreName("REWE");
//        storeRepository.save(rewe);
//    }
//}
