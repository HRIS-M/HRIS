package com.hris.HRIS.controller;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.EmployeeModel;
import com.hris.HRIS.repository.EmployeeRepository;
import com.hris.HRIS.service.SystemAutomateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/employee")
public class EmployeeController {
    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    SystemAutomateService systemAutomateService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse> saveEmployee(@RequestPart("photo") MultipartFile photo,
                                                    @RequestParam("name") String name,
                                                    @RequestParam("email") String email,
                                                    @RequestParam("phone") String phone,
                                                    @RequestParam("address") String address,
                                                    @RequestParam("organizationId") String organizationId,
                                                    @RequestParam("departmentId") String departmentId,
                                                    @RequestParam("jobData") String jobData,
                                                    @RequestParam("gender") String gender,
                                                    @RequestParam("dob") String dob,
                                                    @RequestParam("nic") String nic,
                                                    @RequestParam("status") String status,
                                                    @RequestParam("level") String level
                                                    ) throws IOException {

//        Integer.parseInt(jobData);
        ObjectMapper objectMapper = new ObjectMapper();
        Object fixedJobData = objectMapper.readValue(jobData, Object.class);

        EmployeeModel newEmployee = new EmployeeModel();
        newEmployee.setName(name);
        newEmployee.setEmail(email);
        newEmployee.setPhone(phone);
        newEmployee.setAddress(address);
        newEmployee.setOrganizationId(organizationId);
        newEmployee.setDepartmentId(departmentId);
        newEmployee.setJobData(fixedJobData);
        newEmployee.setGender(gender);
        newEmployee.setDob(dob);
        newEmployee.setNic(nic);
        newEmployee.setPhoto(photo.getBytes());
        newEmployee.setStatus(status);
        newEmployee.setLevel(Integer.parseInt(level));

        EmployeeModel emp = employeeRepository.save(newEmployee);

        systemAutomateService.updateOrganizationEmployees(newEmployee);
        systemAutomateService.assignChannelsToEmployee(emp.getId());

        ApiResponse apiResponse = new ApiResponse("Employee saved successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/get/all")
    public List<EmployeeModel> getAllEmployees(){
        return employeeRepository.findAll();
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<EmployeeModel> getEmployeeById(@PathVariable String id){
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findById(id);

        return employeeModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/email/{email}")
    public ResponseEntity<EmployeeModel> getEmployeeByEmail(@PathVariable String email){
        Optional<EmployeeModel> employeeModelOptional = employeeRepository.findOneByEmail(email);

        return employeeModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/update/id/{id}")
    public ResponseEntity<ApiResponse> updateEmployee(@PathVariable String id, @RequestBody EmployeeModel employeeModel){
        systemAutomateService.updateEmployeeAndUpdateOrganization(id, employeeModel);

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/update/email/{email}")
    public ResponseEntity<ApiResponse> updateEmployeeByEmail(@PathVariable String email, @RequestBody EmployeeModel employeeModel){
        systemAutomateService.updateEmployeeAndUpdateOrganizationByEmail(email, employeeModel);

        ApiResponse apiResponse = new ApiResponse("Employee updated successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/id/{id}")
    public ResponseEntity<ApiResponse> deleteEmployee(@PathVariable String id){
        systemAutomateService.deleteEmployeeAndUpdateOrganization(id);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/delete/email/{email}")
    public ResponseEntity<ApiResponse> deleteEmployeeByEmail(@PathVariable String email){
        systemAutomateService.deleteEmployeeAndUpdateOrganizationByEmail(email);

        ApiResponse apiResponse = new ApiResponse("Employee deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
