const fs = require('fs');
const fsAsync = fs.promises;

const Pdf = require('pdf-parse');

class ConvertPdf {
  constructor(pathPdf) {
    this.pdf = [];
    this.pathPdf = pathPdf;
  }

  async convert() {
    const dataBuffer = await fsAsync.readFile(this.pathPdf);

    const data = await Pdf(dataBuffer);

    const pages = this.split_pages(data);
    const pages_with_sections = this.split_sections(pages);

    const pages_separeted_properties = this.separe_properties(
      pages_with_sections,
    );

    this.pdf = pages_separeted_properties;
    // this.printBody();
  }
  printBody() {
    console.log(this.pdf[0].body);
  }
  exportAsCsv(pathCsv) {
    console.log(this.pdf);
    fsAsync.writeFile(`${pathCsv}.csv`, [
      this.cabecalho(),
      this.pdf.map(page => page.body),
    ]);
  }

  separe_properties(pages) {
    // pages is an arrayde {header, body, footer}
    // "Codigo",
    // "Descricao do Produto",
    // "UN",
    // "Quantidade",
    // "Valor Unit.",
    // "Valor Total"

    const pages_separed = pages.map(page => {
      let isTerminated = false;
      const pages_separed_properties = page.body.map(line => {
        if (isTerminated) return '';
        if (line.indexOf('TOTAL GERAL R$') !== -1) {
          isTerminated = true;
          return '';
        }
        const codigo = line.slice(0, 9);
        const descricao = line.slice(10, 50);
        const un = line.slice(67, 73);
        const quantidade = line.slice(83, 96);
        const valor_unitario = line.slice(97, 113);
        const valor_total = line.slice(114, 133);

        return `${codigo};${descricao};${un};${quantidade};${valor_unitario};${valor_total}\n`;
      });
      return { ...page, body: pages_separed_properties };
    });
    return pages_separed;
  }
  /*
	 4875-5 ADESIVO INST.3G SCOTCH BOND 3M           -               UN        1,000         9,000             1,85               16,65\n
  */
  split_sections(pages) {
    const pages_with_sections = pages.map(page => {
      const tam_line = 134;
      const tam_header = 791;
      const tam_body = 51 * tam_line;
      const tam_footer = 271;
      const header = page.substr(0, tam_header);
      const body = page.substr(tam_header, tam_body);

      const lines_text = [];
      for (let i = 0; i < 51; i++) {
        const line = i * tam_line;

        lines_text.push(body.substring(line, line + tam_line));
      }

      const footer = page.substr(tam_header + tam_body, tam_footer);

      return { header, body: lines_text, footer };
    });

    return pages_with_sections;
  }

  split_pages(data) {
    const pages = [];

    const { numpages: numPages } = data;
    let text = '';
    text = data.text;
    const tam_line_page = 7896;
    for (let i = 0; i < numPages; i++) {
      const inicio = tam_line_page * i;
      const fim = tam_line_page * (i + 1);

      pages.push(text.slice(inicio, fim));
    }
    return pages;
  }

  cabecalho() {
    let titles = [
      'Codigo',
      'Descricao do Produto',
      'UN',
      'Quantidade',
      'Valor Unit.',
      'Valor Total',
    ];
    return `${titles.join(';')}\n`;
  }
}

module.exports = ConvertPdf;
