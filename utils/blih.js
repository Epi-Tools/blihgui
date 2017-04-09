const crypto  = require('crypto')
const request = require('request')

class Blih {

    constructor (email, token) {
        this.baseUrl = 'https://blih.epitech.eu/'
        this.userData = {
            login: email,
            token
        }
    }

    static generateToken(password) {
        return crypto.createHash('sha512').update(password, 'utf8').digest('hex')
    }

    getRepositories(callback) {
        this.createRequest({ verb: 'GET', path: 'repositories' }, undefined, callback)
    }

    getAcl(repository, callback) {
        this.createRequest({ verb: 'GET', path: `repositories/${repository}/acl` }, undefined, callback)
    }

    getRepositoriesInfo(repository, callback) {
        this.createRequest({ verb: 'GET', path: `repositories/${repository}` }, undefined, callback)
    }

    getSshKey(callback) {
        this.createRequest({ verb: 'GET', path: 'sshkey' }, undefined, callback)
    }

    createRepository(repository, callback) {
        this.createRequest({ verb: 'POST', path: 'repositories' }, { name: repository, type: 'git' }, callback)
    }

    getAcl(repository, callback) {
        this.createRequest({ verb: 'GET', path: `repositories/${repository}/acl` }, undefined, callback)
    }

    setAcl(repository, username, rights, callback) {
        this.createRequest({ verb: 'POST', path: `repositories/${repository}/acl` },
            { acl: rights, user: username }, callback)
    }

    setSshKey(sshkey, callback) {
        this.createRequest({ verb: 'POST', path: 'sshkey' }, { sshkey: key }, callback)
    }

    deleteSshKey(keyid, callback) {
        this.createRequest({ verb: 'DELETE', path: `sshkey/${keyid}` }, undefined, callback)
    }

    deleteRepository(repository, callback) {
        this.createRequest({ verb: 'DELETE', path: `repositories/${repository}` }, undefined, callback)
    }

    sendRequest(signed_json, verb, path, callback) {
        if (verb !== 'GET' && verb !== 'POST' && verb !== 'DELETE')
            return callback('Error: Invalid http method')

        if (path.substring(0, 12) !== 'repositories' && path.substring(0, 6) !== 'sshkey')
            return callback('Error: Invalid path data')

        const options = { uri: `${this.baseUrl}user/${path}`, method: verb, json: signed_json }

        return request(options, (error, response, body) => {
            if (body.error != undefined)
                error = body.error
            callback(error, body)
        })
    }

    createRequest(argData, postData, callback) {
        const signatureData = { user: this.userData.login, signature: '' }
        const hashing = crypto.createHmac('sha512', this.userData.token)
        hashing.update(this.userData.login)
        if (postData !== undefined) {
            const string = JSON.stringify(postData, null, 4);
            hashing.update(string)
            signatureData.data = postData
        }
        signatureData.signature = hashing.digest('hex').toString()
        return this.sendRequest(signatureData, argData.verb, argData.path, callback)
    }
}

module.exports = Blih