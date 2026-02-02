package mmu.sef.fyj.dto;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScholarshipDTO {

    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Application deadline is required")
    @Future(message = "Deadline must be in the future")
    private LocalDate applicationDeadline;

    private int reviewerId;

    private Set<int> committeeIds = new HashSet<>();
}
