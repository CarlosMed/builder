import gulp from 'gulp';
import path from 'path';
import posthtml from 'gulp-posthtml';
import less from 'gulp-less';
import sync from 'browser-sync';

gulp.task('html', () => {
  const plugin = [
    require('posthtml-include')({
      root: path.join(__dirname, 'src/assets/templates')
    })
  ];

  gulp
    .src('./src/entrypoints/**/*.html')
    .pipe(posthtml(plugin))
    .pipe(gulp.dest('./dist'));
});

gulp.task('less', () =>
  gulp
    .src('./src/assets/less/**/*.less')
    .pipe(
      less({
        paths: [path.join(__dirname, 'less', 'includes', 'src/assets')]
      })
    )
    .pipe(gulp.dest('./dist/css'))
    .pipe(sync.stream())
);

gulp.task('serve', ['html', 'less', 'copy-files'],
  () => {
    sync.init({
      server: {
        baseDir: './dist',
        directory: true
      }
    });

    gulp.watch('./src/assets/less/**/*.less', ['less']);
    gulp
      .watch(['./src/entrypoints/**/*.html', './dist/test/test.html'], ['html'])
      .on('change', sync.reload);
  }
);

gulp.task('copy-files', () => {
  gulp.src( './src/assets/images/*' ).pipe( gulp.dest( './dist/images' ) );
  gulp.src( './src/assets/bootstrap/*' ).pipe( gulp.dest( './dist/bootstrap' ) );
  gulp.src( './src/assets/less/*' ).pipe( gulp.dest( './dist/less' ) );
});

gulp.task('default', ['serve']);
