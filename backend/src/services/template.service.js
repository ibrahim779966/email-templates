const TemplateRepository = require('../repository/template.model');
const { TemplateNotFoundError } = require('../utils/errors'); 

class TemplateService {
  
  // Create
  async createTemplate(createTemplateDto) {
    const newTemplate = new TemplateRepository(createTemplateDto);
    await newTemplate.save();
    return newTemplate;
  }

  // Read Single
  async getTemplateById(templateId) {
    const template = await TemplateRepository.findById(templateId);
    if (!template) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found.`);
    }
    return template;
  }

  // Read All by Work ID
  async getTemplatesByWorkId(workId) {
    return TemplateRepository.find({ workId }).sort({ updatedAt: -1 });
  }

  // Update
  async updateTemplate(templateId, updateFields) {
    const updatedTemplate = await TemplateRepository.findByIdAndUpdate(
      templateId,
      { $set: updateFields }, 
      { new: true, runValidators: true }
    );

    if (!updatedTemplate) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found for update.`);
    }
    return updatedTemplate;
  }

  // Delete
  async deleteTemplate(templateId) {
    const deletedTemplate = await TemplateRepository.findByIdAndDelete(templateId);

    if (!deletedTemplate) {
      throw new TemplateNotFoundError(`Template ID ${templateId} not found for deletion.`);
    }
    return { message: 'Template successfully deleted.' };
  }
}

module.exports = new TemplateService();