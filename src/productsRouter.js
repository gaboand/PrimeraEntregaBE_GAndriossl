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
  try {
    await productManager.addProduct(req.body);
    res.status(201).send({ message: 'Producto agregado' });
  } catch (error) {
    res.status(500).send({ error: 'Error al agregar el producto' });
  }
});

router.put('/:pid', async (req, res) => {
  try {
    const result = await productManager.updateProduct(parseInt(req.params.pid), req.body);
    if (result) {
      res.json(result);
    } else {
      res.status(404).send({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar el producto' });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(parseInt(req.params.pid));
    res.send({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el producto' });
  }
});
      
export default router;
      