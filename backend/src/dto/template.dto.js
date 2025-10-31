// ============================================
// FILE: dto/template.dto.js
// PURPOSE: Data Transfer Objects - define data structures for API
// RESPONSIBILITIES: Structure and validate data shape for requests
// ============================================

/**
 * DTO for creating a new template
 * Used to structure incoming data from API requests
 */
class CreateTemplateDto {
  constructor(name, cloudinaryUrl, workId, previewImageUrl) {
    this.name = name;
    this.cloudinaryUrl = cloudinaryUrl;
    this.workId = workId; // User or project identifier
    this.previewImageUrl = previewImageUrl;
  }
}

/**
 * DTO for updating an existing template
 * Used to structure incoming data for update requests
 */
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