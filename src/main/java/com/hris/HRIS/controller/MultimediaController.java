package com.hris.HRIS.controller;

import com.hris.HRIS.dto.ApiResponse;
import com.hris.HRIS.model.MultimediaModel;
import com.hris.HRIS.repository.MultimediaRepository;
import com.hris.HRIS.service.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@RestController
@RequestMapping("/api/v1/multimedia")
public class MultimediaController {
    @Autowired
    MultimediaRepository multimediaRepository;

    @Autowired
    PhotoService photoService;

    public final AtomicReference<String> receivedID = new AtomicReference<>();

    @PostMapping("/photos/add")
    public String addPhoto(@RequestParam("title") String title,
                           @RequestParam("file") MultipartFile file) throws IOException {
        String id = photoService.addMultimedia(title, file, "image/jpeg");

        receivedID.set(id);

        return "redirect:/photos/" + id;
    }

    @PostMapping("/videos/add")
    public String addVideo(@RequestParam("title") String title,
                           @RequestParam("file") MultipartFile file) throws IOException {
        String id = photoService.addMultimedia(title, file, "video/mp4");

        receivedID.set(id);

        return "redirect:/videos/" + id;
    }

    @PutMapping("/save/data")
    public ResponseEntity<ApiResponse> saveData(@RequestBody MultimediaModel multimediaModel) {
        Optional<MultimediaModel> optionalMultimediaModel = multimediaRepository.findById(receivedID.get());

        if (optionalMultimediaModel.isPresent()) {
            MultimediaModel existingMultimediaModel = optionalMultimediaModel.get();
            existingMultimediaModel.setUserId(multimediaModel.getUserId());
            existingMultimediaModel.setChannelId(multimediaModel.getChannelId());
            existingMultimediaModel.setChatId(multimediaModel.getChatId());
            existingMultimediaModel.setStatus(multimediaModel.getStatus());
            existingMultimediaModel.setTimestamp(multimediaModel.getTimestamp());

            multimediaRepository.save(existingMultimediaModel);

            return ResponseEntity.ok(new ApiResponse("Data saved successfully"));
        }

        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<byte[]> getMultimedia(@PathVariable String id) {
        MultimediaModel multimedia = photoService.getMultimedia(id);

        if (multimedia != null && multimedia.getFile() != null && multimedia.getFile().getData() != null) {
            byte[] content = multimedia.getFile().getData();

            HttpHeaders headers = new HttpHeaders();

            // Set content type dynamically based on multimedia content type
            if (multimedia.getContentType() != null) {
                headers.setContentType(MediaType.parseMediaType(multimedia.getContentType()));
            }

            // Set Content-Disposition header to force download or display inline
            headers.setContentDisposition(ContentDisposition.builder("attachment").filename("filename").build());

            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/get/id/{id}")
    public ResponseEntity<MultimediaModel> getMultimediaById(@PathVariable String id) {
        Optional<MultimediaModel> multimediaModelOptional = multimediaRepository.findById(id);

        return multimediaModelOptional.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/get/all")
    public ResponseEntity<Iterable<MultimediaModel>> getAllMultimedia() {
        return ResponseEntity.ok(multimediaRepository.findAll());
    }

    @GetMapping("/get/user/{id}")
    public ResponseEntity<List<MultimediaModel>> getAllMultimediaByUser(@PathVariable String id) {
        Optional<List<MultimediaModel>> multimediaModelOptional = multimediaRepository.findAllByUserId(id);
        return ResponseEntity.ok(multimediaModelOptional.orElse(null));
    }

    @GetMapping("/get/channel/{id}")
    public ResponseEntity<List<MultimediaModel>> getAllMultimediaByChannel(@PathVariable String id) {
        Optional<List<MultimediaModel>> multimediaModelOptional = multimediaRepository.findAllByChannelId(id);
        return ResponseEntity.ok(multimediaModelOptional.orElse(null));
    }

    @GetMapping("/get/chat/{id}")
    public ResponseEntity<List<MultimediaModel>> getAllMultimediaByChat(@PathVariable String id) {
        Optional<List<MultimediaModel>> multimediaModelOptional = multimediaRepository.findAllByChatId(id);
        return ResponseEntity.ok(multimediaModelOptional.orElse(null));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteMultimedia(@PathVariable String id) {
        multimediaRepository.deleteById(id);

        ApiResponse apiResponse = new ApiResponse("Multimedia deleted successfully");
        return ResponseEntity.ok(apiResponse);
    }
}
