package com.haha.groceries.controller;

import com.haha.groceries.io.GoodsRequest;
import com.haha.groceries.io.GoodsResponse;
import com.haha.groceries.service.GoodsService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
@CrossOrigin("*") //
public class GoodsController {

    private final GoodsService goodsService;

    @PostMapping
    public GoodsResponse addGood(@RequestPart("good") String goodString,
                                 @RequestPart("file")MultipartFile file) {
        ObjectMapper objectMapper = new ObjectMapper();
        GoodsRequest request = null;

        request = objectMapper.readValue(goodString, GoodsRequest.class);
        GoodsResponse response = goodsService.addGood(request, file);
        return response;
    }

    @GetMapping("/goods")
    public List<GoodsResponse> readGoods() { return goodsService.readGoods(); }

    @GetMapping("/{storeId}/goods")
    public List<GoodsResponse> readGoods(@PathVariable String storeId) {

        return goodsService.readGoods(storeId);
    }

    @GetMapping("/{id}")
    public GoodsResponse readGood(@PathVariable String id) {
        return goodsService.readGood(id);
    }

    @DeleteMapping("/{id}")
    public void deleteGood(@PathVariable String id) {
        goodsService.deleteGood(id);
    }
}
