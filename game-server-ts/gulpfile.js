var gulp       = require('gulp');
var ts         = require('gulp-typescript');
var uglify     = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var supervisor = require( "gulp-supervisor" );
var fs         = require("fs");

function deleteall(path) {  
    var files = [];  
    if(fs.existsSync(path)) {  
        files = fs.readdirSync(path);  
        files.forEach(function(file, index) {  
            var curPath = path + "/" + file;  
            if(fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);  
            } else { // delete file  
                fs.unlinkSync(curPath);  
            }  
        });  
        fs.rmdirSync(path);  
    }  
};  

function clear_output(){
    deleteall("../game-server/app")
    deleteall("../game-server/global")
}


gulp.task('release', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }));

    return tsResult
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/'));

});

gulp.task('debug', function () {
    var tsResult = gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }));

    return tsResult
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/'));

});


gulp.task('dev', ['debug'], function() {
    clear_output();
    gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/'));

    gulp.watch('src/**/*.ts', ['debug']);
});

gulp.task( "dev_run", function() {
    clear_output();
    gulp.src('src/**/*.ts')
        .pipe(ts({
            noImplicitAny: false
        }))
        .pipe(uglify())
        .pipe(sourcemaps.write()) // Now the sourcemaps are added to the .js file
        .pipe(gulp.dest('../game-server/'));

    gulp.watch('src/**/*.ts', ['debug']);
    supervisor( "../game-server/app.js",{
        watch: [ "../game-server/app","../game-server/global","../game-server/app.js" ]
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