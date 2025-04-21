const mindee = require("mindee");
const { Readable } = require("stream");

const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const getReceiptDetails = async (buffer) => {
  const mindeeClient = new mindee.Client({
    apiKey: "c083ecb3dab1df04d3c06008b024b02b",
  });
  const filestream = bufferToStream(buffer);
  const inputSource = mindeeClient.docFromStream(filestream, "receipt.jpg");

  const resp = await mindeeClient.parse(mindee.product.ReceiptV5, inputSource);

  const doc = resp.document.inference.prediction;

  return {
    storeName: doc.supplierName?.value || "",
    storeLocation: doc.supplierAddress?.value || "",
    date: doc.date?.value || "",
    time: doc.time?.value || "",
    totalAmount: doc.totalAmount?.value || 0,
    taxAmount: doc.totalTax?.value || 0,
    receiptNumber: doc.receiptNumber?.value || "",
    items:
      doc.lineItems?.map((item) => ({
        name: item.description || "",
        price: item.totalAmount || 0,
        quantity: item.quantity ?? 1,
      })) || [],
  };
};

module.exports = {
  getReceiptDetails,
};
