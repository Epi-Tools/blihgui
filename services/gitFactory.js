/**
 * Created by carlen on 4/9/17.
 */
const exec = require('child_process').exec

app.factory('gitService', () => {

    const wesh = msg => console.log(msg)
    const baseCmd = (name, path, username) => `git clone git@git.epitech.eu:/${username}/${name} ${path}/${name}`

    const execCmd = cmd => new Promise((success, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) reject(error)
            else success(stdout)
        })
    })

    return { clone: (name, path, username) => execCmd(baseCmd(name, path, username)) }
})
