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

const injection = ({source, dest}) => {
    return new Promise((resolve, reject) => {
        $.pump([
            gulp.src(source.root),
            $.inject(gulp.src(source.libs, {
                read: true
            }).pipe($.angularFilesort()), {
                relative: false,
                name: 'libs',
                transform: filepath => {
                    const file = filepath.replace('/dist/', '')
                    return `<script type="text/javascript" charset="utf-8" src="${file}" defer></script>`
                }
            }),
            $.inject(gulp.src(source.app, {
                read: false
            }), {
                relative: false,
                transform: filepath => {
                    const jsExt = filepath.match(/\.js/i)
                    const cssExt = filepath.match(/\.css/i)
                    const file = filepath.replace('/dist/', '')
                    if (jsExt) {
                        return `<script type="text/javascript" charset="utf-8" src="${file}" defer></script>`
                    } else if (cssExt) {
                        return `<link rel="stylesheet" type="text/css" href="${file}">`
                    }
                }
            }),
            gulp.dest(dest)
            .on('end', () => server.hot())
        ], resolve)
    })
}

module.exports = injection
