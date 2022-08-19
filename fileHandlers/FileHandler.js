const fs = require('fs');

class FileHandler {
  constructor(fileName) {
    this.fileName = fileName;
  }

  getAll = async () => {
      let fileContentsAsString = "";
      try {
          fileContentsAsString = await fs.promises.readFile(this.fileName, "utf-8");
      }catch(error) {
          console.log("File could not be found")
      }
      try {
          return JSON.parse(fileContentsAsString);
      } catch(SyntaxError) {
          //inicializa el array para insertar al archivo el primer objeto cuando no se hizo un save
          console.log("File empty");
          return [];
      }
  }

  getById = async(id) => {
    try {
      let fileContent = await this.getAll();
      let product = fileContent.find(product => product.id == id);
      if (typeof product === 'undefined') {
        console.log('Product not found');
        return null;
      }
      return product;
    } catch (error) {
      console.log(`Error reading file ${this.filename}: ${error}`);
    }
  };

  save = async(product) => {
    try {
      let fileContent = await this.getAll();
      const lastItem = fileContent[fileContent.length - 1];
      let newId = 0;
      if (typeof lastItem !== 'undefined') {
        newId = lastItem.id + 1;
        if (fileContent.some(productInFile => productInFile.title === product.title)) {
          //'The product is already in the file';
          return null;
        }
      }
      const newObjectToAppend = { ...product, id: newId };
      const updatedFile = [...fileContent, newObjectToAppend];
      await fs.promises.writeFile(this.fileName, JSON.stringify(updatedFile));
      return newId;
    } catch (error) {
      console.log(`Error reading file ${this.filename}: ${error}`);
      return null;
    }
  };

  deleteById = async(id) => {
    try {
      let fileContent = await this.getAll();
      let productFound = false;
      fileContent = fileContent.filter(product => {
        if (product.id === id) {
          productFound = true;
        }
        return product.id !== id
      });
      await fs.promises.writeFile(this.fileName, JSON.stringify(fileContent));
      return productFound;
    } catch (error) {
      console.log('Error deleting product');
    }
  };
  deleteAll = async () => {
    try {
      await fs.promises.writeFile(this.fileName, '[]');
    } catch (error) {
      console.log("File couldn't be updated");
    }
  };
  changeProduct = async (newProduct) => {
    try {
      let fileContent = await this.getAll();
      const lastItem = fileContent[fileContent.length - 1];
      if (isNaN(newProduct.id) || typeof newProduct.price !== "number" || !newProduct.title) {
        return "ID, price and name should be of type integer and should be specified";
      }
      //'If the product is already in the file, it is deleted from the file
      fileContent = fileContent.filter(productInFile => productInFile.title !== newProduct.title);
      if (fileContent.some(productInFile => productInFile.id === newProduct.id)) {
        //id has to be replaced
        const indexForReplacement = fileContent.findIndex(product => product.id === newProduct.id);
        fileContent[indexForReplacement] = {id: newProduct.id, title: newProduct.title, price: newProduct.price};
      } else {
        fileContent.push({id: newProduct.id, title: newProduct.title, price: newProduct.price, image: image})
      }
        await fs.promises.writeFile(this.fileName, JSON.stringify(fileContent));
        return (newProduct.id);
    } catch (error) {
      console.log(error);
      return "File couldn't be updated";
    }
  }
}
module.exports = FileHandler;