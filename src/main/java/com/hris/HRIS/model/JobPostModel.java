package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "jobPost")
public class JobPostModel {

    @Id
    private String id;

    private String organizationId;

    private String caption; //means title

    private String about_job;

    private String technical_requirements;

    private String education_requirements;

    private String responsibilities;

    private String experience_level;

    private String open_date;

    private String end_date;

    private String contact_email;

    private String description;
}
