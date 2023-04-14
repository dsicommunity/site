// const GhostAdminAPI = require('@tryghost/admin-api');
// const gulp = require('gulp');
//
//
// var autoprefixer = require('autoprefixer');
// var colorFunction = require('postcss-color-function');
// var cssnano = require('cssnano');
// var customProperties = require('postcss-custom-properties');
// var easyimport = require('postcss-easy-import');
// var sourcemaps = require('gulp-sourcemaps');
// var postcss = require('gulp-postcss');
// var livereload = require('gulp-livereload');
// var nodemon = require('gulp-nodemon');
//
// function uploader(done) {
//     const filename = require('./package.json').name + '.zip';
//
//     const api = new GhostAdminAPI({
//         // Replace URL with your own
//         url: 'http://localhost:2368',
//         version: "v3",
//         // Obtain API key by creating a new integration at http://localhost:2368/ghost/#/settings/integrations
//         key: 'c0356be5e176eb158509d5f780:6439b70b45141c000140485c:0603f49f0f8afab64d5b6a464642ee24a224043f168ffdeef3c38bf1912ab55a'
//     });
//
//     let data = { file: `./dist/${filename}` }
//
//     return api.themes.upload(data)
//         .catch(done);
// }
//
// // const build = series(css, js);
// // exports.deploy = series(build, zipper, uploader);
//
// gulp.task('css', function (done) {
//     const processors = [
//         easyimport,
//         customProperties,
//         colorFunction(),
//         autoprefixer({browsers: ['last 2 versions']}),
//         cssnano()
//     ];
//     gulp.src('assets/css/*.css')
//         // .on('error', swallowError)
//         .pipe(sourcemaps.init())
//         .pipe(postcss(processors))
//         .pipe(sourcemaps.write('.'))
//         .pipe(gulp.dest('dist'))
//         .pipe(livereload())
//         .on('end', done);
// });
// gulp.task('upload', function () {
//     uploader();
// });
// gulp.task('default', gulp.series('css'));
//
// function css(done) {
//     // Omitted because it's in a regular Casper theme
// }
//
// function js(done) {
//     // Omitted because it's in a regular Casper theme
// }
//
// function zipper(done) {
//     // Omitted because it's in a regular Casper theme
// }
// import dependencies

const GhostAdminAPI = require('@tryghost/admin-api');

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    zip = require('gulp-zip');

const sass = require('gulp-sass')(require('sass'));

// define some variables
var source = '.',
    destination = 'dist',
    distribution = 'dist';

async function uploader(done) {
    const name = require('./package.json').name;
    const api = new GhostAdminAPI({
        // Replace URL with your own
        url: 'http://localhost:2368',
        version: "v3",
        // Obtain API key by creating a new integration at http://localhost:2368/ghost/#/settings/integrations
        key: '6439b70b45141c000140485c:0603f49f0f8afab64d5b6a464642ee24a224043f168ffdeef3c38bf1912ab55a'
    });

    await api.themes.upload({file: `./dist/${name}.zip`});
    await api.themes.activate(name);
}

// task: compile sass to css
gulp.task('sass', function () {
    return gulp.src(source + 'assets/scss/**/*.scss') // source
        .pipe(sass())   // compile sass()
        .pipe(gulp.dest(source + 'assets/css')); // generate
});

// task: package to zip
gulp.task('package', function (done) {
    gulp.src([
        source + '/**/*', // include all in source folder
        '!' + source + '/node_modules', // exclude node_modles
        '!' + source + '/node_modules/**/*', // exclude sub folders of node_modles
        '!' + source + '/*.png' // exclude screenshots in source folder
    ], {base: source})
        .pipe(zip('site.zip'))
        .pipe(gulp.dest(distribution));
    done();
});

// watch changes
gulp.task('watch', function () {
    gulp.src([
        source + '/**/*',
        '!' + source + '/node_modules', // exclude node_modles
        '!' + source + '/node_modules/**/*' // exclude sub folders of node_modles
    ], {base: source})
        .pipe(watch(source, {base: source}))
        .pipe(gulp.dest(destination));
});

// task: clean old files
gulp.task('clean:build', function (done) {
    // deleteSync(distribution + '/fizzy.zip'); // remove old zip file
    done();
});

// task: clean without images
gulp.task('clean:dev', function (done) {
    del([
        destination + '/**/*', // remove all old files
        '!' + destination + 'assets/images', // exclude images folder
        '!' + destination + 'assets/images/**/*' // exclude image files
    ]);
    done();
});


gulp.task('upload', function () {
    uploader();
});
// dev
gulp.task('dev', gulp.series('clean:dev', ['sass', 'watch']));

// package
gulp.task('build', gulp.series('sass', 'package'));
gulp.task('upload');
