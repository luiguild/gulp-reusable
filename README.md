# gulp-reusable
A powerful boilerplate to work with Gulp 3.9 with SASS, PUG and ES6+ with reusable tasks.

This project work on a NodeJS 6+ with JS-ES6+ innovations and the parts of the code are packages, it's just require one to use :)

### How to use
**1** Clone this repo
<br>
**2** install it

Using | Command line
------------- | -------------
yarn | `yarn`
npm | `npm install`

**3** Setup your configuration file (`gulpfile.config.js`), the ESLint config (`.eslintrc.js`), the Babel config (`.babelrc` < only if you will use Babel, obviously) and be sure that all paths and files are right and ready to be processed

<br>
**4** Run!

yarn | Command line
------------- | -------------
dev | `yarn dev`
build | `yarn build`

npm | Command line
------------- | -------------
dev | `npm run dev`
build | `npm run build`

#### Lint your code
- Make sure that your JS code are standardized with ESLint

#### Transpile your JS-ES6+
- Write your code using the new features of ES6+ and put to ES2015 using Babel+Babelify and Browserify or just minify your file using UglifyJS.

Using Browserify and Babel (ES2015 + stage-0 preset are built-in)
```javascript
gulp.task('make:js', () => {
    return script({
        source: config.files.js.src, // your input file coming from the configuration
        eslint: true, // using eslint?
        concat: `${config.app.name}.js`, // if you prefer concatenate all your JS files into a single one, set a name
        transpiler: [
            'browserify',
            'babel'
        ], // set the transpiler
        rename: '.min', // if you want rename the final file
        dest: config.files.js.dest, // your output file coming from the configuration
        injection: true // if you want the this file will injected in your index
    })
})
```

With a simple change, setting up UglifyJS
```javascript
gulp.task('make:js:static', () => {
    return script({
        source: config.files.static.js.src,
        transpiler: 'uglify', // i'm comfortable with my code, just minify
        rename: '.min',
        dest: config.files.static.js.dest,
        injection: true
    })
})
```

#### Work with SASS or SCSS and CSS
- You can use all the power of these preprocessors and/or pure CSS!

- All files will be combined, autoprefixed, purged, beautified, validated and cleaned by default

The function recognize the file extension and call the preprocessor automatically, if necessary
```javascript
gulp.task('make:sass', () => {
    return style({
        source: config.files.sass.src, // your input file coming from the configuration
        rename: '.min', // if you want rename the final file
        dest: config.files.sass.dest, // your output file coming from the configuration
        injection: true // if you want the this file will injected in your index
    })
})
```

#### Configurable files structure
- It's simple! You set your file paths and run the tasks!

With a simple setup, your production environment will be created
```javascript
const app = {
    name: ''
}

const paths = {
    src: 'src/',
    dist: 'dist/',
    static: 'static/'
}
```

#### Reusable tasks
- You can call similar tasks passing others parameters without duplicate them and if you need an specific thing, just edit the main function to expand and adjust to your case.

- All functions already have an callback to help you work with clear logs about the errors

- The functions doesn't have with the traditional `.pipe` to control the stream, instead of this, I prefer work with `pump()` package. If you want know more about it > https://www.npmjs.com/package/pump

#### Autoloader packages
- You not need require a package every time that you install something new to Gulp work with it!

#### Minify
- With a simple parameter, you set if your output file will be minified or not.

#### Rename
- You can rename your files with a new name or just adding a `.min` extension.

#### Concatenate files
- Put all JS/CSS/HTML files into a single one.

#### File injection
- If you use a template engine (like a PugJS), all your dependencies will be added automatically in your `index.html`.

In your PugJS 'index' you just need add these comments
```pug
head
    // inject:css
    // endinject

body
    // libs:js
    // endinject
    // inject:js
    // endinject
```

The injection task
```javascript
gulp.task('make:injection', () => {
    return injection({
        source: {
            root: config.files.templates.production[0], // your index file coming from the configuration
            libs: [
                `${config.paths.dist}static/js/**/*.js`
            ], // if you need put some libs
            app: [
                `${config.paths.dist}js/**/*.js`,
                `${config.paths.dist}css/**/*.css`,
                `${config.paths.dist}static/css/**/*.css`
            ] // your output files
        },
        dest: config.paths.dist // the final destination of your index already injected
    })
})

```

#### Browser sync
- At every new build, BrowserSync will refresh the browser to you.

#### Template controls
- You can work with a 'index' page separately of the others one.

#### Watching files
- At every change that you do in your code, Gulp will make a new build to you!

You can call this function as many times you want
```javascript
watch({
    source: config.files.templates.debug[0], // your input file(s) coming from the configuration
    task: 'make:pug:index' // task that will be run at every change
})
```

#### Create a production-ready folder structure
- Gulp will manage the production folder to you.

- **SUGGESTION**
```
myApp
    dist
        css
            myApp.min.css
        js
            myApp.min.js
        static
            css
                vendor.min.css
            fonts
                fontawesome.woff2
            img
                logo.png
            js
                vendor.min.js
        templates
            home
                home.html
        index.html

    src
        js
            myApp.js
        sass
            myApp.sass
        pug
            myApp.pug

    static
        css
            vendor.css
        fonts
            fontawesome.woff2
        img
            logo.png
        js
            vendor.js
```


## To contribute and make it better
Clone the repo, change what you want and send PR

###### Contributions are always welcome!
