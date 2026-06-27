package com.haha.groceries.entity;

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
@Document(collection = "goods")
public class GoodsEntity {

    @Id
    private String id;
    private String name;
    private String description;
    private String imgUrl;
    private double price;
    private String category;
    private String storeId;
}
