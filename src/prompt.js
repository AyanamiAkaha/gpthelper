const fs = require('fs');
const path = require('path');

const defaultOptions = {
  promptTemplate: 'empty',
  templateDirs: [path.join(__dirname, '../prompt-templates')],
};

module.exports = function generatePrompt(userPrompt, options) {
  const { promptTemplate, templateDirs } = { ...defaultOptions, ...options };
  let template;
  for (let i=0; i<templateDirs.length && !template; i++) {
    template = fs.readFileSync(path.join(templateDirs[i], `${promptTemplate}.json`));
  }
  if (!template) {
    throw new Error(`Cannot find prompt template ${template}.json in any of: ${templateDirs.join('; ')}`);
  }
  return JSON.parse(template.toString('utf-8')
    .replace('###PROMPT###', userPrompt[0].replace(/[\n\r]+/g, '\\n')));
};
