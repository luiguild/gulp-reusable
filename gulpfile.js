'use strict'

/**
 * Environment declaration
 */
const gulp = require('gulp')
const nameDeps = require('app-name')
const loadDeps = require('load-deps')
const camelCase = require('camelcase')
const stripDeps = ['gulp']
const config = require('./gulpfile.config')
const style = require('./gulpfile.style')
const template = require('./gulpfile.template')
const script = require('./gulpfile.script')
const watch = require('./gulpfile.watch')
const server = require('./gulpfile.server')
const injection = require('./gulpfile.injection')
const renameFn = name => {
    return camelCase(nameDeps(name, stripDeps))
}
const $ = loadDeps('*', {
    renameKey: renameFn
})

/**
 * Server + HotReaload
 */
gulp.task('start:serve', () => {
    process.env.NODE_ENV = 'development'

    return server.create({
        path: config.paths.dist
    })
})

/**
 * Watchers
 */
gulp.task('start:watch', () => {
    watch({
        source: config.files.templates.debug[0],
        task: 'make:pug:index'
    })

    watch({
        source: config.files.templates.debug[1],
        task: 'make:pug:templates'
    })

    watch({
        source: config.files.sass.debug,
        task: 'make:sass'
    })

    watch({
        source: config.files.js.debug,
        task: 'make:js'
    })

    watch({
        source: config.files.static.src,
        task: 'copy'
    })

    watch({
        source: config.files.static.js.src,
        task: 'make:js:static'
    })
})

/**
 * Generic tasks
 */
gulp.task('make:sass', () => {
    return style({
        source: config.files.sass.src,
        rename: '.min',
        dest: config.files.sass.dest,
        injection: true
    })
})

gulp.task('make:css:static', () => {
    return style({
        source: config.files.static.css.src,
        concat: 'qtGeneral.css',
        rename: '.min',
        dest: config.files.static.css.dest,
        injection: true
    })
})

gulp.task('make:pug:index', () => {
    return template({
        source: config.files.templates.src[0],
        rename: 'index.html',
        dest: config.paths.dist,
        injection: true
    })
})

gulp.task('make:pug:templates', () => {
    return template({
        source: config.files.templates.src[1],
        dest: config.files.templates.dest,
        injection: false,
        reload: true
    })
})

gulp.task('make:js', () => {
    return script({
        source: config.files.js.src,
        eslint: true,
        concat: `${config.app.name}.js`,
        transpiler: [
            'browserify',
            'babel'
        ],
        rename: '.min',
        dest: config.files.js.dest,
        injection: true
    })
})

gulp.task('make:js:static', () => {
    return script({
        source: config.files.static.js.src,
        transpiler: 'uglify',
        rename: '.min',
        dest: config.files.static.js.dest,
        injection: true
    })
})

gulp.task('copy:static', cb => {
    $.pump([
        gulp.src(config.files.static.src),
        gulp.dest(config.files.static.dest)
    ], cb)
})

gulp.task('make:injection', () => {
    return injection({
        source: {
            root: config.files.templates.production[0],
            libs: [
                `${config.paths.dist}static/js/**/*.js`
            ],
            app: [
                `${config.paths.dist}js/**/*.js`,
                `${config.paths.dist}css/**/*.css`,
                `${config.paths.dist}static/css/**/*.css`
            ]
        },
        dest: config.paths.dist
    })
})

/**
 * Build tasks
 */
gulp.task('default', ['build'])

gulp.task('serve', () => {
    $.runSequence('build')

    setTimeout(() => {
        console.log('Preparing to serve...')
        $.runSequence('start:watch', 'start:serve')
    }, 10000)
})

gulp.task('build', () => {
    process.env.NODE_ENV = 'production'
    $.runSequence(
        'copy:static',
        'make:js',
        'make:js:static',
        'make:sass',
        'make:css:static',
        'make:pug:index',
        'make:pug:templates',
        'make:injection'
    )
})
