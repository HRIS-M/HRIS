package com.hris.HRIS.repository;

import com.hris.HRIS.model.ApplyJobModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ApplyJobRepository extends MongoRepository<ApplyJobModel, String> {

    List<ApplyJobModel> findByFavoriteTrue();
}
