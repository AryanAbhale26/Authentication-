const ensureAuth = require("../middleware/Authp");
const router = require("express").Router();

// GET route for /products
router.get("/", ensureAuth, (req, resp) => {
  resp.status(200).json([
    { name: "mobile", price: 10000 },
    { name: "tv", price: 2000 },
  ]);
});

// Add POST route for /products
router.post("/", ensureAuth, (req, resp) => {
  const { name, price } = req.body;

  // Basic validation
  if (!name || !price) {
    return resp.status(400).json({ message: "Name and price are required" });
  }

  // Respond with a success message (or add logic to save product)
  resp
    .status(201)
    .json({ message: "Product created", product: { name, price } });
});

module.exports = router;
