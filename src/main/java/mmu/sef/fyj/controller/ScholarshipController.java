package mmu.sef.fyj.controller;

@RestController
@RequestMapping("/api/scholarships")
@RequiredArgsConstructor
public class ScholarshipController {

    private final ScholarshipService scholarshipService;

    @GetMapping
    public ResponseEntity<List<Scholarship>> getAllScholarships() {
        return ResponseEntity.ok(scholarshipService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scholarship> getScholarshipById(@PathVariable int id) {
        return scholarshipService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Scholarship> createScholarship(@Valid @RequestBody ScholarshipDTO dto) {
        Scholarship scholarship = scholarshipService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(scholarship);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Scholarship> updateScholarship(
            @PathVariable int id,
            @Valid @RequestBody ScholarshipDTO dto) {
        return scholarshipService.update(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScholarship(@PathVariable int id) {
        scholarshipService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{scholarshipId}/apply/{applicationId}")
    public ResponseEntity<Scholarship> applyToScholarship(
            @PathVariable int scholarshipId,
            @PathVariable int applicationId) {
        return scholarshipService.applyScholarship(scholarshipId, applicationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/applications")
    public ResponseEntity<Set<Application>> getApplications(@PathVariable int id) {
        return scholarshipService.getApplications(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
