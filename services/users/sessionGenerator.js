const crypto = require('crypto')
const config = require('config')

module.exports = async (userInfo) => {
	let session = {
		id: userInfo.id,
		name: userInfo.name,
		username: userInfo.username,
		role: userInfo.role
	}
	return session
}
