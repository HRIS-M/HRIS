package com.hris.HRIS.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.hris.HRIS.model.CoursePresentationModal;

public interface CoursePresentationRepository extends MongoRepository<CoursePresentationModal, String> {
    
}
