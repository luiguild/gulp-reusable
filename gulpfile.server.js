const nameDeps = require('app-name')
const loadDeps = require('load-deps')
const camelCase = require('camelcase')
const stripDeps = ['gulp']
const renameFn = name => {
    return camelCase(nameDeps(name, stripDeps))
}
const $ = loadDeps('*', {
    renameKey: renameFn
})

const server = {
    create: ({path}) => {
        $.browserSync.init({
            server: {
                baseDir: path
            }
        })
    },
    status: () => $.browserSync.active(),
    reload: () => $.browserSync.reload(),
    hot: () => {
        if (server.status) {
            server.reload()
        }
    }
}

module.exports = server
