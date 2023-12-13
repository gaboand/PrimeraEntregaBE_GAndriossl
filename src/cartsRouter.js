import express from 'express';
import CartManager from './CartManager.js';

const router = express.Router();
const cartManager = new CartManager('./src/carts.json');

router.post('/', async (req, res) => {
  const cartId = await cartManager.createCart();
  res.status(201).send({ message: 'Carrito creado', id: cartId });
});


export default router;
