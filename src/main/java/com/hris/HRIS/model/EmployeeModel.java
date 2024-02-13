package com.hris.HRIS.model;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@ToString

@Document(collection = "employee")
public class EmployeeModel {
    @Id
    private String id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private Object jobData;
    private String gender;
    private String dob;
    private String photo;
    private String password;
    private String status;
    private Integer level;
    private String token;
    private String refreshToken;
    private String otp;
    private String otpExpiry;
}