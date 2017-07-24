const gulp = require('gulp')
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

const watch = ({source, task}) => {
    if (typeof task === 'string') {
        task = [task]
    }

    gulp.watch([source], file => {
        $.runSequence(task)
    })
}

module.exports = watch
