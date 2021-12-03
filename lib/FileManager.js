const Configstore = require('configstore');
const pkg = require('../package.json');

class FileManager {
  constructor() {
    this.conf = new Configstore(pkg.name);
    if(!this.getFile()){
      this.setFile('./data/transactions.csv');
    }
  }

  setFile(file) {
    this.conf.set('filePath', file);
    return file;
  }

  getFile() {
    const file = this.conf.get('filePath');

    if (!file) {
      throw new Error('No file Found');
    }

    return file;
  }

}

module.exports = FileManager;