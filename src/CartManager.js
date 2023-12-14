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

  async saveCarts() {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.carts, null, 2), "utf-8");
    } catch (error) {
      console.error('Error al guardar los carritos:', error);
    }
  }

  async createCart() {
    const newCart = {
      id: this.cartIdCounter++,
      products: []
    };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart.id;
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    const productIndex = cart.products.findIndex(p => p.id === productId);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ id: productId, quantity });
    }
    await this.saveCarts();
  }

  getCartProducts(cartId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    return cart ? cart.products : null;
  }
}

export default CartManager;
