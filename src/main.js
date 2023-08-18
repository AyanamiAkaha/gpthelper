const yargs = require('yargs');
const generatePrompt = require('./prompt');
const callGPT = require('./gpt');

const { argv } = yargs
  .option('api-key', {
    alias: 'k',
    describe: 'GPT API key',
    default: process.env.GPT_API_KEY || '',
  })
  .option('dry-run', {
    describe: 'Perform a dry run (no API request)',
    boolean: true,
    default: false,
  })
  .option('model', {
    alias: 'm',
    describe: 'GPT model to use',
    default: 'gpt-3.5-turbo',
  })
  .option('temperature', {
    alias: 't',
    describe: '`temperature` parameter of the GPT (randomness)',
    default: 0.8,
  })
  .option('prompt', {
    alias: 'p',
    describe: 'Prompt to use',
    default: 'empty',
    demandOption: false,
  });

async function main(conf) {
  const apiKey = conf['api-key'];
  const dryRun = conf['dry-run'];
  const { model, temperature } = conf;

  const promptOptions = {
    promptTemplate: argv.prompt,
  };
  const userPrompt = argv._;

  const prompt = generatePrompt(userPrompt, promptOptions);
  if (dryRun) {
    // eslint-disable-next-line no-console
    console.log(prompt);
  } else {
    const result = await callGPT(prompt, { apiKey, model, temperature });
    // eslint-disable-next-line no-console
    console.log(result);
  }
}

// eslint-disable-next-line no-console
main(argv).catch((err) => { console.error(err); });
