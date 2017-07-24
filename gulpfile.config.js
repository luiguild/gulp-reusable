const app = {
    name: ''
}

const paths = {
    src: 'src/',
    dist: 'dist/',
    static: 'static/'
}

const files = {
    js: {
        src: [
            `${paths.src}js/${app.name}.js`
        ],
        dest: `${paths.dist}js`,
        debug: [
            `${paths.src}js/**/*.js`,
            `${paths.src}app/**/*.js`
        ],
        production: `${paths.dist}js/${app.name}.min.js`
    },
    sass: {
        src: `${paths.src}sass/${app.name}.sass`,
        dest: `${paths.dist}css`,
        debug: `${paths.src}sass/**/*.sass`,
        production: `${paths.dist}css/${app.name}.min.css`
    },
    templates: {
        src: [
            `${paths.src}pug/${app.name}.pug`,
            `${paths.src}app/**/*.pug`
        ],
        dest: `${paths.dist}templates`,
        debug: [
            `${paths.src}pug/**/*.pug`,
            `${paths.src}app/**/*.pug`
        ],
        production: [
            `${paths.dist}index.html`,
            `${paths.dist}/templates/**/**`
        ]
    },
    static: {
        src: [
            `${paths.static}**/**`,
            `!${paths.static}js/**`,
            `!${paths.static}css/**`
        ],
        dest: `${paths.dist}${paths.static}`,
        js: {
            src: `${paths.static}js/**/*.js`,
            dest: `${paths.dist}${paths.static}js`
        },
        css: {
            src: `${paths.static}css/**/*.css`,
            dest: `${paths.dist}${paths.static}css`
        }
    }
}

module.exports = {
    app,
    paths,
    files
}
