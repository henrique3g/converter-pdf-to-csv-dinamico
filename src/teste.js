const convert = require('./ConvertPdf');

async function main() {
  await convert('../janeiro.pdf', './', 'teste4444');
}

main();
