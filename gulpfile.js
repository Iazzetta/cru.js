var gulp = require('gulp');
const minify = require('gulp-minify');
 
gulp.task('default', async () => {
  gulp.src(['src/cru.js'])
    .pipe(minify({noSource:true}))
    .pipe(gulp.dest('dist'))
    .pipe(gulp.dest('docs'))
});