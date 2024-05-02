package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.CredentialsModel;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.model.OrganizationModel;
import com.hris.HRIS.repository.CredentialsRepository;
import com.hris.HRIS.repository.EmployeeRepository;
import com.hris.HRIS.repository.OrganizationRepository;
import com.hris.HRIS.service.EmailService;
import com.hris.HRIS.shared.objects.JobData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/v1/organization")
public class OrganizationController {
    @Autowired
    OrganizationRepository organizationRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    CredentialsRepository credentialsRepository;

    @Autowired
    EmailService emailService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveOrganization(@RequestBody OrganizationModel organizationModel) {
        OrganizationModel orgModel = organizationRepository.save(organizationModel);

        JobData jobData = new JobData();
        jobData.setPosition("Administrator");
        jobData.setDepartment("");
        jobData.setDoj(String.valueOf(new Date()));
        jobData.setSalary("");

        EmployeeModel employeeModel = new EmployeeModel();
        employeeModel.setName(organizationModel.getContactPerson());
        employeeModel.setEmail(organizationModel.getEmail());
        employeeModel.setPhone(organizationModel.getPhone());
        employeeModel.setOrganizationId(orgModel.getId());
        employeeModel.setJobData(jobData);
        employeeModel.setLevel(0);

        employeeRepository.save(employeeModel);

        String password = String.valueOf(random_Password(10));
        String name = employeeModel.getName().split(" ")[0];
        String para = "Thank you for choosing us as your organization's HR Information platform. We can help you to manage your organization easily and in flexible ways. You are the main administrator of your organization and start your journey with SPARKC HR Systems.\n\n" +
                "Email: "+organizationModel.getEmail()+"\n" +
                "Password: "+password+"\n\n" +
                "We hope you can work with us on a long journey and for any further assistance, don't hesitate to get in touch with us at support@sparckc.com.\n\n";
        String tag = "Best Regards,\nTeam SPARKC.\n\n";
        String footer = "Powered by SparkC";

        CredentialsModel credentialsModel = new CredentialsModel();
        credentialsModel.setEmail(organizationModel.getEmail());
        credentialsModel.setPassword(password);
        credentialsModel.setLevel("0");
        credentialsRepository.save(credentialsModel);
//            TODO: //uncomment email service in prod mode
//        emailService.sendSimpleEmail(organizationModel.getEmail(), "Organization Registration", "Dear " + name + ",\n" + para + tag + footer);

        ApiResponse apiResponse = new ApiResponse("Organization saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    static char[] random_Password(int len) {
        String Capital_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String Small_chars = "abcdefghijklmnopqrstuvwxyz";
        String numbers = "0123456789";
        String symbols = "!@#$%^&*_=+-/.?<>)";


        String values = Capital_chars + Small_chars +
                numbers + symbols;

        // Using random method
        Random rndm_method = new Random();

        char[] password = new char[len];

        for (int i = 0; i < len; i++) {
            password[i] = values.charAt(rndm_method.nextInt(values.length()));
        }
        return password;
    }

    @GetMapping("/get/all")
    public List<OrganizationModel> getAllOrganization() {
        return organizationRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<OrganizationModel> getOrganizationById(String id) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<OrganizationModel> getOrganizationByEmail(String email) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findByEmail(email);

        return organizationModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateOrganization(@PathVariable String id, @RequestBody OrganizationModel organizationModel) {
        Optional<OrganizationModel> organizationModelOptional = organizationRepository.findById(id);

        if (organizationModelOptional.isPresent()) {
            OrganizationModel existingOrganization = organizationModelOptional.get();
            existingOrganization.setOrganizationName(organizationModel.getOrganizationName());
            existingOrganization.setContactPerson(organizationModel.getContactPerson());
            existingOrganization.setEmail(organizationModel.getEmail());
            existingOrganization.setAddress(organizationModel.getAddress());
            existingOrganization.setPhone(organizationModel.getPhone());
            organizationRepository.save(existingOrganization);

            ApiResponse apiResponse = new ApiResponse("Organization updated successfully");
            return ResponseEntity.ok(apiResponse);
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteOrganization(@PathVariable String id) {
        organizationRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Organization deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
