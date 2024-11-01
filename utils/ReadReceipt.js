const mindee = require('mindee');

const getReceiptDetails = async (filestream) => {
    const mindeeClient = new mindee.Client({apiKey: "c083ecb3dab1df04d3c06008b024b02b"});
    const inputSource = mindeeClient.docFromStream(filestream);

    const apiResponse = mindeeClient.parse(
        mindee.product.ReceiptV5,
        inputSource
    )
    .then((resp) => {

    })


}

module.exports = {
    getReceiptDetails
}