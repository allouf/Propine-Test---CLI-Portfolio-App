const inquirer = require('inquirer');
const colors = require('colors');
const FileManager = require('../lib/FileManager');
const { isRequired } = require('../utils/validation');
var path = require('path');
const fs = require("fs");

const file = {
  async set() {
    const fileManager = new FileManager();
    const input = await inquirer.prompt([
      {
        type: 'input',
        name: 'file',
        message: 'Enter CSV file '.green ,
        validate: isRequired
      }
    ]);

    var file;

    if (fs.existsSync(input.file)) {
      var ext = path.extname(input.file);
      if(ext == '.csv'){
        file = fileManager.setFile(input.file);
        console.log('file Set'.blue);
      }
      else
        console.error("not CSV file".red);
      }
      else{
        console.error("wrong path file".red);
      }
    },
  show() {
    try {
      const fileManager = new FileManager();
      const file = fileManager.getFile();

      console.log('Current file: ', file.yellow);

      return file;
    } catch (err) {
      console.error(err.message.red);
    }
  }
};

module.exports = file;