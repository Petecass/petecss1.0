'use-strict';

var         gulp = require('gulp'),
          concat = require('gulp-concat'),
          uglify = require('gulp-uglify'),
          rename = require('gulp-rename'),
            sass = require('gulp-sass'),
            maps = require('gulp-sourcemaps'),
      autoprefix = require('gulp-autoprefixer'),
          useref = require('gulp-useref'),
           bower = require('gulp-bower'),
  mainBowerFiles = require('main-bower-files'),
          filter = require('gulp-filter'),
             del = require('del'),
             iff = require('gulp-if'),
           pages = require('gulp-gh-pages'),
            csso = require('gulp-csso');


  var options = {
           src : './src',
          dist : './dist',
      bowerDir : './bower_components'
};

gulp.task('clean', function() {
  del(['dist', options.src + '/css/application.css*']);
});

gulp.task('cleanBower', function(){
    del([options.bowerDir]);
});

gulp.task('bower', function(){
  return bower()
        .pipe(gulp.dest(options.bowerDir))

});

gulp.task('startBower',['cleanBower', 'bower', 'moveCss', 'moveJs']);

gulp.task('icons', function(){
  return gulp.src(options.bowerDir + '/devicon/fonts/**.*')
             .pipe(gulp.dest(options.src + '/fonts'))
});

gulp.task('moveJs', function(){
  gulp.src(mainBowerFiles())
      .pipe(filter('*.js'))
      .pipe(gulp.dest(options.src + '/js'))
});

gulp.task('moveCss', function(){
  gulp.src(mainBowerFiles())
      .pipe(filter('*.css'))
      .pipe(gulp.dest(options.src + '/css'))
});

gulp.task('moveBower', ['moveCss', 'moveJs', 'icons']);

gulp.task('concatScripts', function(){
  return gulp.src([options.src + "/js/jquery.js",
            options.src + "/js/jquery.animsition.min.js",
            options.src + "/js/main.js"])
          .pipe(maps.init())
          .pipe(concat('/app.js'))
          .pipe(maps.write('./'))
          .pipe(gulp.dest(options.src + '/js'));
});

gulp.task('minifyScripts', ['concatScripts'], function(){
  return  gulp.src(options.src + '/js/app.js')
        .pipe(uglify())
        .pipe(rename('/app.min.js'))
        .pipe(gulp.dest(options.src + '/js'));
});

gulp.task('html', function() {
  var assets = useref.assets();
  gulp.src(options.src + '/*.html')
      .pipe(assets)
      .pipe(iff('*.js', uglify()))
      // .pipe(iff('*.css', csso()))
      .pipe(assets.restore())
      .pipe(useref())
      .pipe(gulp.dest(options.dist));
});

gulp.task('compileSass', function() {
  return gulp.src(options.src + "/scss/application.scss")
      .pipe(maps.init())
      .pipe(sass())
      .pipe(maps.write('./'))
      .pipe(gulp.dest(options.src + '/css'));
});

gulp.task('autoprefix', function(){
  return gulp.src('css/application.css')
          .pipe(autoprefix({
            browsers: ['last 2 versions']
          }))
          .pipe(gulp.dest('test'));
});

gulp.task('watchSass', function(){
  gulp.watch([options.src + '/scss/**/*.scss'], ['compileSass']);
});

gulp.task('build', ['clean', 'compileSass', 'autoprefix', 'html' ], function(){
  return gulp.src([options.src + '/css/**',options.src + '/assets/**', options.src + '/fonts/**'], { base: options.src })
             .pipe(gulp.dest(options.dist));
});

gulp.task('deploy', ['build'] , function(){
    return gulp.src(options.dist + '/**/*')
               .pipe(pages());
});

gulp.task("default", ["clean"], function() {
  gulp.start('build');
});
