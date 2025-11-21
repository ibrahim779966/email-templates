const templateService = require("../services/template.service");
const { generateEmailHTML } = require("../utils/htmlGenerator");

class TemplateUseCase {
  async createTemplate(createDto) {
    // Create template first
    const template = await templateService.createTemplate(createDto);

    // ✅ Generate email HTML automatically from elements
    const emailHtml = generateEmailHTML(template);

    // Update template with generated HTML
    await templateService.updateTemplate(template._id, { emailHtml });

    return {
      ...template.toObject(),
      emailHtml,
    };
  }

  async getTemplatesByWorkId(workId) {
    return await templateService.getTemplatesByWorkId(workId);
  }
  async getPublicTemplates() {
    return await templateService.getPublicTemplates();
  }

  async getTemplateById(templateId) {
    return await templateService.getTemplateById(templateId);
  }

  async updateTemplate(templateId, updates) {
    // Update template
    const updatedTemplate = await templateService.updateTemplate(
      templateId,
      updates
    );

    // ✅ Regenerate HTML if elements or settings changed
    if (updates.elements || updates.globalSettings) {
      const emailHtml = generateEmailHTML(updatedTemplate);
      await templateService.updateTemplate(templateId, { emailHtml });
      updatedTemplate.emailHtml = emailHtml;
    }

    return updatedTemplate;
  }

  async deleteTemplate(templateId) {
    return await templateService.deleteTemplate(templateId);
  }

  async generateEmailHtml(templateId) {
    const template = await templateService.getTemplateById(templateId);
    return generateEmailHTML(template);
  }
}

module.exports = new TemplateUseCase();
