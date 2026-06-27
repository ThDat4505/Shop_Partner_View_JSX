package com.haha.groceries.service;

import com.haha.groceries.io.GoodsRequest;
import com.haha.groceries.io.GoodsResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface GoodsService {

    String uploadFile(MultipartFile file);

    GoodsResponse addGood(GoodsRequest request, MultipartFile file);

    List<GoodsResponse> readGoods();

    List<GoodsResponse> readGoods(String storeId);

    GoodsResponse readGood(String id);

    boolean deleteFile(String filename);

    void deleteGood(String id);
}
