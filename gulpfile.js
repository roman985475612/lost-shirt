const { src, dest, task, series, watch, parallel } = require('gulp')
const { DIST_PATH, SRC_PATH, STYLES_LIBS, JS_LIBS } = require('./gulp.config')
const rm = require('gulp-rm')
const sass = require('gulp-sass')
const concat = require('gulp-concat')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const sassGlob = require('gulp-sass-glob')
const autoprefixer = require('gulp-autoprefixer')
const px2rem = require('gulp-smile-px2rem')
const gcmq = require('gulp-group-css-media-queries')
const cleanCss = require('gulp-clean-css')
const sourcemaps = require('gulp-sourcemaps')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const svgo = require('gulp-svgo')
const svgSprite = require('gulp-svg-sprite')
const gulpIf = require('gulp-if')
const webp = require('gulp-webp')
const imagemin = require('gulp-imagemin')


sass.compiler = require('node-sass')

const env = process.env.NODE_ENV

task('clean', () => {
    return src([`${DIST_PATH}/**/*`, `!${DIST_PATH}/images/**/*`], {read: false})
        .pipe(rm())
})

task('copy:html', () => {
    return src(`${SRC_PATH}/*.html`)
        .pipe(dest(`${DIST_PATH}`))
        .pipe(reload({stream: true}))
})

task('copy:fonts', () => {
    return src(`${SRC_PATH}/fonts/**/*`)
        .pipe(dest(`${DIST_PATH}/fonts`))
})

task('copy:icons', () => {
    return src(`${SRC_PATH}/icons/**/*`)
        .pipe(dest(`${DIST_PATH}/icons`))
})

task('styles', () => {
    return src([...STYLES_LIBS, `${SRC_PATH}/styles/main.scss`])
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.min.scss'))
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        // .pipe(px2rem())
        .pipe(gulpIf(env === 'prod', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true
        })))
        .pipe(gulpIf(env === 'prod', gcmq()))
        .pipe(gulpIf(env === 'prod', cleanCss()))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/css`))
        .pipe(reload({stream: true}))
})

task('scripts', () => {
    return src([...JS_LIBS, `${SRC_PATH}/scripts/*.js`])
        .pipe(gulpIf(env === 'dev', sourcemaps.init()))
        .pipe(concat('main.min.js', {newLine: ';'}))
        .pipe(gulpIf(env === 'prod', babel({
            presets: ["@babel/env"]
        })))
        .pipe(gulpIf(env === 'prod', uglify()))
        .pipe(gulpIf(env === 'dev', sourcemaps.write()))
        .pipe(dest(`${DIST_PATH}/js`))
        .pipe(reload({stream: true}))
})

task('imgToWebp', () => {
    return src(`${SRC_PATH}/images/**/*.{png,jpg,jpeg}`)
        .pipe(webp())
        .pipe(dest(`${DIST_PATH}/images`))
})

task('images', () => {
    return src(`${SRC_PATH}/images/**/*.{png,jpg,jpeg}`)
        .pipe(imagemin())
        .pipe(dest(`${DIST_PATH}/images`))
})

task('icons', () => {
    return src(`${SRC_PATH}/icons/*.svg`)
        .pipe(svgo({
            plugins: [
                {
                    removeAttrs: {
                        attrs: "(fill|stroke|style|width|data.*)"
                    }
                }
            ]
        }))
        .pipe(svgSprite({
            mode: {
                symbol: {
                    sprite: "../sprite.svg"
                }
            }
        }))
        .pipe(dest(`${DIST_PATH}/images/i`))
})

task('server', () => {
    browserSync.init({
        server: {
            baseDir: `./${DIST_PATH}`
        },
        open: false
    })
})

task('watch', () => {
    watch(`./${SRC_PATH}/styles/**/*.scss`, series('styles'))
    watch(`./${SRC_PATH}/scripts/**/*.js`, series('scripts'))
    watch(`./${SRC_PATH}/*.html`, series('copy:html'))
})

task('default', 
    series(
        'clean', 
        parallel('copy:html', 'styles', 'scripts', 'copy:fonts', 'copy:icons'), 
        parallel('watch', 'server')
    )
)

task('build', 
    series(
        'clean', 
        parallel('copy:html', 'styles', 'scripts', 'images', 'imgToWebp', 'copy:icons', 'copy:fonts')
    ) 
)
