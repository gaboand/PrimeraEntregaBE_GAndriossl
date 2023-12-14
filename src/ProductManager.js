import fs from 'fs/promises';

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = []; 
    this.productIdCounter = 1;
    this.loadProducts(); 
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
      this.productIdCounter = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0) + 1;
    } catch (error) {
      console.error('Error al cargar los productos:', error);
    }
  }

  async saveProducts() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), "utf-8");
    } catch (error) {
      console.error('Error al guardar los productos:', error);
    }
  }

  async addProduct(product) {
    await this.loadProducts();

    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.error('El código del producto ya existe');
      return;
    }

    product.id = this.productIdCounter++;
    this.products.push(product);
    await this.saveProducts();
    console.log('Producto agregado con éxito');
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    const product = this.products.find(product => product.id === productId);

    if (product) {
      return product;
    } else {
      console.error('Producto no encontrado');
      return null;
    }
  }

  async updateProduct(productId, updatedFields) {
    const productIndex = this.products.findIndex(product => product.id === productId);

    if (productIndex !== -1) {
      const originalProduct = { ...this.products[productIndex] };

      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedFields
      };

      await this.saveProducts();

      const updatedProduct = this.products[productIndex];
      const updatedFieldsList = Object.keys(updatedFields);

      console.log(`Producto actualizado con éxito. Producto:`, updatedProduct);
      console.log(`Campo actualizado: ${updatedFieldsList.join(', ')}`);

      return { originalProduct, updatedProduct, updatedFields };
    } else {
      console.error('Producto no encontrado para actualizar');
      return null;
    }
  }

  async deleteProduct(productId) {
    const initialLength = this.products.length;
    this.products = this.products.filter(product => product.id !== productId);

    if (this.products.length === initialLength) {
      console.error('Producto no encontrado para eliminar');
    } else {
      await this.saveProducts();
      console.log('Producto eliminado con éxito');
    }
  }
}

export default ProductManager;
