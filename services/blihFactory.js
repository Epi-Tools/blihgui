/**
 * Created by carlen on 3/23/17.
 */
const crypto = require('crypto')
const exec = require('child_process').exec

app.factory('blihService', () => {
    const baseCmd = (username, token, cmd) => `blih -u ${username} -t ${token} ${cmd}`
    const execCmd = cmd => new Promise((success, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) reject(error)
            else success(stdout)
        })
    })

    return  {
        getToken: password => crypto.createHash('sha512').update(password).digest('hex'),
        getRepositoryList: (username, token) => execCmd(baseCmd(username, token, 'repository list')),
        postRepo: (username, token, name) => execCmd(baseCmd(username, token, `repository create ${name}`)),
        deleteRepo: (username, token, name) => execCmd(baseCmd(username, token, `repository delete ${name}`))
    }
})
