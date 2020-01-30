const convert = require('./ConvertPdfwithouClass');

async function main() {
  await convert('../janeiro.pdf', './', 'teste4444');
}

main();
