const fs = require('fs');
const path = require('path');

const defaultOptions = {
  promptTemplate: 'empty',
  templateDirs: [path.join(__dirname, '../prompt-templates')],
};

module.exports = function generatePrompt(userPrompt, options) {
  const templateDirs = [...defaultOptions.templateDirs, ...options.templateDirs || []];
  const { promptTemplate } = { ...defaultOptions, ...options };
  let template;
  for (let i=0; i<templateDirs.length && !template; i++) {
    const p = path.join(templateDirs[i], `${promptTemplate}.json`);
    if (fs.existsSync(p)) {
      template = fs.readFileSync(p);
      break;
    }
  }
  if (!template) {
    throw new Error(`Cannot find prompt template ${template}.json in any of: ${templateDirs.join('; ')}`);
  }
  return JSON.parse(template.toString('utf-8')
    .replace('###PROMPT###', JSON.stringify(userPrompt).slice(1, -1)));
};
