var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var supervisor = require( "gulp-supervisor" );

gulp.task('release', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }));

    return tsResult
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/app/'));

});

gulp.task('debug', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }));

    return tsResult
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/app/'));

});

gulp.task('release', ['release'], function() {
    gulp.watch('src/**/*.ts', ['release']);
});


gulp.task('dev', ['debug'], function() {
    gulp.watch('src/**/*.ts', ['debug']);
});

gulp.task( "dev_run", function() {
    gulp.watch('src/**/*.ts', ['debug']);
    supervisor( "../game-server/app.js",{
        watch: [ "../game-server/app" ]
    } );
} );
//
// gulp.task( "supervisor-all", function() {
//     supervisor( "test/fixture/server.js", {
//         args: [],
//         watch: [ "test" ],
//         ignore: [ "tasks" ],
//         pollInterval: 500,
//         extensions: [ "js" ],
//         exec: "node",
//         debug: true,
//         debugBrk: false,
//         harmony: true,
//         noRestartOn: false,
//         forceWatch: true,
//         quiet: false
//     } );
// } );