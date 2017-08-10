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
const d = new Date()
const h = ('0' + d.getHours()).slice(-2)
const m = ('0' + d.getMinutes()).slice(-2)
const s = ('0' + d.getSeconds()).slice(-2)
const instant = '[' + `${h}:${m}:${s}`.grey + ']'

const server = {
    create: ({path}) => {
        $.browserSync.init({
            server: {
                baseDir: path
            }
        })
    },
    start: () => {
        console.log(instant, 'BrowserSync'.bold.cyan)
        console.log(instant, 'Starting development server... '.magenta)
        return $.runSequence('start:watch', 'start:serve')
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
