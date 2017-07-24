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

const script = ({
    source,
    eslint,
    concat,
    transpiler,
    rename,
    dest,
    injection,
    reload
}, cb) => {
    const env = process.env.NODE_ENV

    if (typeof transpiler === 'string') {
        transpiler = [transpiler]
    }

    const transpilers = [
        [
            'browserify',
            $.browserify({
                transform: [
                    'babelify'
                ]
            })
        ],
        [
            'babel',
            $.babel({
                presets: [
                    [
                        'es2015',
                        {
                            modules: 'umd'
                        }
                    ],
                    'stage-0'
                ],
                comments: false,
                minified: true
            })
        ],
        [
            'uglify',
            $.uglify({
                compress: false,
                mangle: false
            })
        ]
    ]

    const findTranspiler = transpiler => {
        return transpiler.map((elmM) => {
            return transpilers.reduce((acc, [item, fun]) => {
                if (item === elmM) {
                    acc.push(fun)
                }
                return acc
            }, [])[0]
        })
    }

    const stream = [
        gulp.src(source),
        $.sourcemaps.init()
    ]

    if (eslint) {
        stream.splice(1, 0,
        $.eslint(),
        $.eslint.formatEach(),
        $.eslint.failOnError())
    }

    if (concat) {
        stream.splice(4, 0, $.concat(concat))
    }

    if (transpiler) {
        stream.push(...findTranspiler(transpiler))
    }

    if (rename === '.min') {
        stream.push($.rename(path => {
            path.basename += '.min'
        }))
    } else {
        stream.push($.rename(rename))
    }

    stream.push($.jsvalidate(),
        $.sourcemaps.write('.'),
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

module.exports = script
