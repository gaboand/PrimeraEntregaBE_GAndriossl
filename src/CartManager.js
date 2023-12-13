import fs from 'fs/promises';

class CartManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.cartIdCounter = 1;
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      this.carts = JSON.parse(data);
      this.cartIdCounter = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id), 0) + 1;
    } catch (error) {
      console.error('Error al cargar los carritos:', error);
      this.carts = [];
    }
  }
}

export default CartManager;
