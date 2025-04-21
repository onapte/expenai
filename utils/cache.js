const NodeCache = require('node-cache');

const dashboardCache = new NodeCache({ stdTTL: 600 });

module.exports = dashboardCache;