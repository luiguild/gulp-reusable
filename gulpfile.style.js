const gulp = require('gulp')
const nameDeps = require('app-name')
const loadDeps = require('load-deps')
const camelCase = require('camelcase')
const stripDeps = ['gulp']
const server = require('./gulpfile.server')
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

const style = ({
    source,
    concat,
    rename,
    dest,
    injection,
    reload
}, cb) => {
    const env = process.env.NODE_ENV
    const ext = extension => source.indexOf(extension) !== -1
    const fileName = source.toString().split('.').shift().split('/').pop()
    const finalName = () => {
        if (rename === '.min') {
            if (fileName === '*') {
                if (concat) {
                    return concat.toString().split('.').shift() + rename + '.css'
                } else {
                    return fileName + rename + '.css'
                }
            } else {
                return fileName + rename + '.css'
            }
        }
    }

    const stream = [
        gulp.src(source),
        $.autoprefixer(),
        $.cssPurge(),
        $.csscomb(),
        $.cssbeautify({
            indent: '   ',
            openbrace: 'end-of-line',
            autosemicolon: true
        }),
        $.sourcemaps.init(),
        $.cleanCss({
            compatibility: 'ie8',
            keepSpecialComments: 'none',
            specialComments: 'none',
            debug: true,
            removeEmpty: true
        }, details => {
            console.log(instant, 'cleanCSS'.bold.cyan)
            console.log(instant, 'Output: '.magenta + `${finalName() || details.name}`)
            console.log(instant, 'Original: '.magenta + `${(details.stats.originalSize / 1024).toFixed(2)}kb`)
            console.log(instant, 'Minified: '.magenta + `${(details.stats.minifiedSize / 1024).toFixed(2)}kb`)
        })
    ]

    if (ext('.sass') || ext('.scss')) {
        stream.splice(1, 0, $.sass())
    } else {
        if (concat) {
            stream.splice(1, 0, $.concat(concat))
        }
    }

    if (rename === '.min') {
        stream.push($.rename(path => {
            path.basename += '.min'
        }))
    } else {
        stream.push($.rename(rename))
    }

    stream.push($.sourcemaps.write('.'),
        gulp.dest(dest).on('end', () => {
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

module.exports = style
