const crypto = require('crypto')
const config = require('config')
const secret = config.get('secret.password')

module.exports = async (password) => {
	let passwordProcessResult = await crypto.createHmac('RSA-SHA512', secret)
														 						 .update(password)
														 						 .digest('hex')
	return passwordProcessResult
}
