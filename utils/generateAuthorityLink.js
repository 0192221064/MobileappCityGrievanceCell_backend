// backend/utils/generateAuthorityLink.js

const crypto = require('crypto');

function generateAuthorityLink(reportId) {
  const token = crypto.randomBytes(12).toString('hex');
  return {
    token,
    url: `https://authority.citygrievancecell.com/report/${reportId}?token=${token}`
  };
}

module.exports = generateAuthorityLink;
