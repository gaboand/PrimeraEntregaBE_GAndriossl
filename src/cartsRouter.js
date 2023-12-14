import express from 'express';
import CartManager from './CartManager.js';

const router = express.Router();
const cartManager = new CartManager('./src/carts.json');

router.post('/', async (req, res) => {
  try {
    const cartId = await cartManager.createCart();
    res.status(201).send({ message: 'Carrito creado', id: cartId });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.post('/:cid/product', async (req, res) => {
  try {
    const { cid } = req.params;
    const { productId, quantity } = req.body;
    await cartManager.addProductToCart(parseInt(cid), productId, quantity);
    res.status(201).send({ message: 'Producto añadido al carrito' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/:cid/products', (req, res) => {
  const { cid } = req.params;
  const products = cartManager.getCartProducts(parseInt(cid));
  if (products) {
    res.json(products);
  } else {
    res.status(404).send({ error: 'Carrito no encontrado' });
  }
});

export default router;
