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
  constructor(
    name,
    workId,
    elements = [],
    globalSettings = {},
    previewImageUrl = "",
    category = "Other" // default value
  ) {
    this.name = name;
    this.workId = workId;
    this.elements = elements;
    this.globalSettings = globalSettings;
    this.previewImageUrl = previewImageUrl;
    this.category = category; // added here
  }
}

/**
 * DTO for updating an existing template
 * Used to structure incoming data for update requests
 */
class UpdateTemplateDto {
  constructor(updates) {
    if (updates.name) this.name = updates.name;
    if (updates.elements) this.elements = updates.elements;
    if (updates.globalSettings) this.globalSettings = updates.globalSettings;
    if (updates.previewImageUrl) this.previewImageUrl = updates.previewImageUrl;
    if (updates.emailHtml) this.emailHtml = updates.emailHtml;
    if (updates.category) this.category = updates.category; // added here
  }
}

module.exports = {
  CreateTemplateDto,
  UpdateTemplateDto,
};
