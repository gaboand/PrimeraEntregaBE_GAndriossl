import express from 'express';
import ProductManager from './ProductManager.js';

const router = express.Router();
const productManager = new ProductManager('./src/whiskies.json');

router.get('/', (req, res) => {
  res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
  const product = productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});

router.post('/', async (req, res) => {
  await productManager.addProduct(req.body); 
  res.status(201).send({ message: 'Producto agregado' });
});

router.put('/:pid', async (req, res) => {
  const result = await productManager.updateProduct(parseInt(req.params.pid), req.body);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send({ error: 'Producto no encontrado' });
  }
});

router.delete('/:pid', async (req, res) => {
  await productManager.deleteProduct(parseInt(req.params.pid));
  res.send({ message: 'Producto eliminado' });
});

export default router;
