const input_file_pdf = document.getElementById('file-pdf');
const input_path_csv = document.getElementById('path-csv');
const input_name_csv = document.getElementById('name-csv');

const name_file_pdf = document.querySelector('.name-file-pdf');
const name_path_csv = document.querySelector('.name-path-csv');

const btn_submit = document.getElementById('btn-submit');

const loader = document.querySelector('.loader');

let file_pdf = '';
let path_csv = '';
let name_csv = '';

const ConvertPdf = require('electron').remote.require('./ConvertPdf');

input_file_pdf.onchange = e => {
  file_pdf = input_file_pdf.files[0].path;

  const path = removePartsOfFullPath(file_pdf, 3);
  name_file_pdf.innerHTML = path;
};

input_path_csv.onchange = e => {
  path_csv = getPath(input_path_csv.files[0].path);
  const path = removePartsOfFullPath(path_csv, 3);
  name_path_csv.innerHTML = path;
};

input_name_csv.onkeyup = e => {
  // name_csv = e;
  name_csv = e.target.value;
};

btn_submit.onclick = async e => {
  e.preventDefault();
  if (file_pdf === '') {
    return alert('Escolha o arquivo PDF');
  }
  if (path_csv === '') {
    return alert('Escolha a pasta para salvar');
  }
  if (name_csv === '') {
    input_name_csv.focus();
    return alert('Digite o nome do CSV');
  }
  loader.style.display = 'block';
  try {
    ConvertPdf(file_pdf, path_csv, name_csv);
  } catch (error) {
    alert('Error: ' + error);
  }
  alert('Pdf convertido com sucesso!!');
  loader.style.display = 'none';
};

function getPath(fullPath) {
  const path = fullPath;
  const path_splited = path.split('/');
  path_splited.pop();
  let path_csv = path_splited.join('/');
  path_csv += '/';
  return path_csv;
}

function removePartsOfFullPath(fullPath, levels = 1) {
  const arrayPath = fullPath.split('/');
  for (let i = 0; i < levels; i++) {
    arrayPath.shift();
  }
  const joinPath = arrayPath.join('/');
  return joinPath;
}
