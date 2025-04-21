const { Router } = require("express");
const dataController = require("../controllers/dataControllers");
const multer = require("multer");
const ReadReceipt = require("../utils/ReadReceipt");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

router.post(
  "/add-expenses",
  upload.single("receiptFile"),
  dataController.addExpenses_post
);

router.post("/parse-receipt", upload.single("file"), async (req, res) => {
  const parsed = await ReadReceipt.getReceiptDetails(req.file.buffer);
  res.json(parsed);
});

router.get("/receipt/:id", dataController.fetchReceipt);

module.exports = router;
