/**
 * Created by carlen on 3/23/17.
 */
const crypto = require('crypto')
const Blih = require('../utils/blih')

app.factory('blihService', () => {

    const wesh = msg => console.log(msg)
    const getBlih = (username, token) => new Blih(username, token)

    return {
        getToken: password => Blih.generateToken(password),
        getRepositoryList: (username, token) => new Promise((success, reject) => {
            getBlih(username, token).getRepositories((err, body) => {
                if (err) reject(err)
                else success(Object.keys(body.repositories))
            })
        }),
        postRepo: (username, token, name) => new Promise((success, reject) => {
            getBlih(username, token).createRepository(name, (err, body) => {
                if (err) reject(err)
                else success(body)
            })
        }),
        deleteRepo: (username, token, name) => new Promise((success, reject) => {
            getBlih(username, token).deleteRepository(name, (err, body) => {
                if (err) reject(err)
                else success(body)
            })
        }),
        getAclRepo: (username, token, name) => new Promise((success, reject) => {
            getBlih(username, token).getAcl(name, (err, body) => {
                if (err) reject(err)
                else success(body)
            })
        }),
        setAclRepo: (username, token, name, user, acl) => new Promise((success, reject) => {
            getBlih(username, token).setAcl(name, user, acl, (err, body) => {
                if (err) reject(err)
                else success(body)
            })
        })
    }
})
