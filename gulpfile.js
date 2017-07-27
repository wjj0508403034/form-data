const gulp = require('gulp');
const del = require('del');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

const DestFolder = "dist";
const SourceFolder = "src";

gulp.task('clean', function() {
  return del([DestFolder], {
    force: true
  });
});

gulp.task('build', ['clean'], function() {
  return gulp.src([`${SourceFolder}/index.js`, `${SourceFolder}/**/*.js`])
    .pipe(concat("huoyun.formdata.js"))
    .pipe(minify({
      ext: {
        src: '.js',
        min: '.min.js'
      }
    }))
    .pipe(gulp.dest(DestFolder));
});