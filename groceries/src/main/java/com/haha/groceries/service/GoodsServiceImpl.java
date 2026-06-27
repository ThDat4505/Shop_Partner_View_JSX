package com.haha.groceries.service;

import com.haha.groceries.entity.GoodsEntity;
import com.haha.groceries.io.GoodsRequest;
import com.haha.groceries.io.GoodsResponse;
import com.haha.groceries.repository.GoodsRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GoodsServiceImpl implements GoodsService{

    @Autowired
    private S3Client s3Client;

    @Autowired
    private GoodsRepository goodsRepository;

    @Value("${aws.s3.bucketname}")
    private String bucketName;

    @Override
    public String uploadFile(MultipartFile file) {
        String filenameExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".")+1);
        String key = UUID.randomUUID().toString()+"."+filenameExtension;

        try {
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .acl("public-read")
                    .contentType(file.getContentType())
                    .build();
            PutObjectResponse response = s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

            // Add condition
            if (response.sdkHttpResponse().isSuccessful()) {
                return "https://" + bucketName + ".s3.amazonaws.com/" + key;
            }
            else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "File upload failed");
            }
        }catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occured while uploading the file");
        }
    }

    @Override
    public GoodsResponse addGood(GoodsRequest request, MultipartFile file) {
        GoodsEntity newGoodEntity = convertToEntity(request);
        String imgUrl = uploadFile(file);
        newGoodEntity.setImgUrl(imgUrl);
        newGoodEntity = goodsRepository.save(newGoodEntity);
        return convertToResponse(newGoodEntity);
    }

    private GoodsEntity convertToEntity(GoodsRequest request) {
        return GoodsEntity.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .build();
    }

    private GoodsResponse convertToResponse(GoodsEntity entity) {
        return GoodsResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .description(entity.getDescription())
                .imgUrl(entity.getImgUrl())
                .price(entity.getPrice())
                .category(entity.getCategory())
                .build();
    }

    @Override
    public List<GoodsResponse> readGoods() {
        List<GoodsEntity> databaseEntries = goodsRepository.findAll();
        return databaseEntries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<GoodsResponse> readGoods(String storeId) {
        List<GoodsEntity> databaseEntries = goodsRepository.findByStoreId(storeId);
        return databaseEntries.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public GoodsResponse readGood(String id) {
        GoodsEntity existingGood = goodsRepository.findById(id).orElseThrow(() -> new RuntimeException("Good not found for the ID: " + id));
        return convertToResponse(existingGood);
    }

    @Override
    public boolean deleteFile(String filename){
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .build();
        s3Client.deleteObject(deleteObjectRequest);
        return true;
    }

    @Override
    public void deleteGood(String id) {
        GoodsResponse response = readGood(id);

        String imgUrl = response.getImgUrl();
        String filename = imgUrl.substring(imgUrl.lastIndexOf("/") + 1);
        boolean isFileDeleted = deleteFile(filename);
        if (isFileDeleted)
            goodsRepository.deleteById(response.getId());
    }
}
