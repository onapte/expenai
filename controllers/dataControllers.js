const User = require("../models/User");
const Expense = require("../models/Expense");
const Receipt = require("../models/Receipt");
const { getUser } = require("../middleware/infoMiddleware");
const { getReceiptDetails } = require("../utils/ReadReceipt");
const { Storage } = require("@google-cloud/storage");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const dashboardCache = require("../utils/cache");

const storage = new Storage({
  keyFilename: path.join(__dirname, "../secrets/gcs_key.json"),
  projectId: "geospatial-ml",
});

const bucketName = "expenai-receipts";
const bucket = storage.bucket(bucketName);

module.exports.addExpenses_post = async (req, res) => {
  try {
    const user = await getUser(req, res);
    const items = JSON.parse(req.body.items);

    let publicUrl = null;

    if (req.file) {
      const filename = `receipts/${uuidv4()}-${user._id}.jpg`;
      const file = bucket.file(filename);

      await file.save(req.file.buffer, {
        metadata: {
          contentType: req.file.mimetype,
        },
        resumable: false,
      });

      // await file.makePublic();
      publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    }

    const expenses = await Promise.all(
      items.map((item) =>
        Expense.create({
          itemName: item.name,
          price: item.price,
          quantity: item.quantity,
        })
      )
    );

    const expenseIds = expenses.map((e) => e._id);
    const receipt = await Receipt.create({
      userId: user._id,
      storeName: req.body.storeName,
      storeLocation: req.body.storeLocation,
      expenseIds,
      receiptUrl: publicUrl || null,
    });

    dashboardCache.del(`dashboard-${user._id}`);

    res.status(201).json({ message: "Success", receiptId: receipt._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add expenses" });
  }
};

module.exports.ReceiptImage_post = async (req, res) => {
  try {
    const user = await getUser(req, res);
    const file = req.body.imageFile;
    const filestream = file.stream();

    const receiptDetails = await getReceiptDetails(filestream);
    res.status(200).json({ receiptDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process receipt image" });
  }
};

module.exports.fetchReceipt = async (req, res) => {
  try {

    const receipt = await Receipt.findById(req.params.id).populate(
      "expenseIds"
    );

    if (!receipt) return res.status(404).json({ error: "Not found" });

    res.json({
      storeName: receipt.storeName,
      storeLocation: receipt.storeLocation,
      date: receipt.date,
      receiptUrl: receipt.receiptUrl,
      expenses: receipt.expenseIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
