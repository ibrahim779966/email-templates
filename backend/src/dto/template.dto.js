// DTO for creating a new template (data input structure)
class CreateTemplateDto {
  constructor(name, cloudinaryUrl, workId, previewImageUrl) {
    this.name = name; 
    this.cloudinaryUrl = cloudinaryUrl; 
    this.workId = workId; // User or project identifier
    this.previewImageUrl = previewImageUrl; 
  }
}

// DTO for updating an existing template (data input structure)
class UpdateTemplateDto {
  constructor(name, cloudinaryUrl, previewImageUrl) {
    this.name = name; 
    this.cloudinaryUrl = cloudinaryUrl; 
    this.previewImageUrl = previewImageUrl; 
  }
}

module.exports = {
  CreateTemplateDto,
  UpdateTemplateDto,
};