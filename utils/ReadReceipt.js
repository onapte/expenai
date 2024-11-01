const mindee = require('mindee');

const getReceiptDetails = async (filestream) => {
    const mindeeClient = new mindee.Client({apiKey: "<apiKey>"});
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
