package com.haha.groceries.io;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoodsRequest {

    private String name;
    private String description;
    private double price;
    private String category;
}
