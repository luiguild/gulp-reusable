const gulp = require('gulp')
const nameDeps = require('app-name')
const loadDeps = require('load-deps')
const camelCase = require('camelcase')
const pug = require('gulp-pug')
const stripDeps = ['gulp']
const server = require('./gulpfile.server')
const renameFn = name => {
    return camelCase(nameDeps(name, stripDeps))
}
const $ = loadDeps('*', {
    renameKey: renameFn
})

const template = ({
    source,
    concat,
    rename,
    dest,
    injection,
    reload
}, cb) => {
    const env = process.env.NODE_ENV
    const ext = extension => source.indexOf(extension) !== -1

    const stream = [
        gulp.src(source)
    ]

    if (ext('.pug')) {
        stream.push(pug({
            pretty: true
        }))
    }

    if (rename) {
        stream.push($.rename(rename))
    }

    stream.push(gulp.dest(dest).on('end', () => {
        if (injection && env === 'development') {
            $.runSequence('make:injection')
        } else {
            if (reload) {
                server.hot()
            }
        }
    }))

    $.pump(stream, cb)
}

module.exports = template
