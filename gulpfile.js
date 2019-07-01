var gulp = require('gulp');
//有gulp前綴的插件不用宣告的功能
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
//環境設定套件
var minimist = require('minimist');
//建議保留這個宣告(不然套件有問題)
var gulpSequence = require('gulp-sequence');


//宣告預設環境
var envOption = {
  string: 'env',
  default: {
    env: 'develop'
  }
}

//宣告環境的選項值
var options = minimist(process.argv.slice(2), envOption)
console.log(options);

//clean開發時的資料夾
gulp.task('clean', function () {
  return gulp.src(['./.tmp', './public'], {
      read: false
    })
    .pipe($.clean());
});

// 自動轉出html到public(沒用jade的時候可以用)
// gulp.task('copyHTML', function () {
//   return gulp.src('./source/**/*.html')
//     .pipe(gulp.dest('./public/'))
//     .pipe(browserSync.stream());
// })

//編譯jade格式
gulp.task('jade', function () {
  return gulp.src(['./source/**/*.jade', '!./source/partials/*.jade'])
    .pipe($.plumber())
    .pipe($.jade({
      pretty: true //未壓縮
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

// 編譯sass格式(包含prefix、sourcemap、壓縮css功能)
gulp.task('sass', function () {
  //設定prefix的瀏覽器範圍
  var plugins = [
    autoprefixer({
      browsers: ['last 3 version', 'ie 6-8']
    })
  ];
  return gulp.src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      'includePaths': ['./node_modules/bootstrap/scss']
    }).on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.if(options.env === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

// 編譯JS es6格式
gulp.task('babel', () => {
  return gulp.src('./source/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    // .pipe($.concat('all.js'))
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe($.if(options.env === 'production', $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream());
});


gulp.task('vendorJS', function () {
  return gulp.src(['./node_modules/jquery/dist/jquery.js', './node_modules/bootstrap/dist/js/bootstrap.bundle.js'])
    //合併前先做排序
    .pipe($.order([
      'jquery.js',
      'bootstrap.bundle.js'
    ]))
    .pipe($.concat('vendors.js'))
    .pipe($.if(options.env === 'production', $.uglify()))
    .pipe(gulp.dest('./public/js'))
})

// 圖片壓縮
gulp.task('image-min', () =>
  gulp.src('./source/img/*')
  .pipe($.if(options.env === 'production', $.imagemin()))
  .pipe(gulp.dest('./public/img'))
);

// 網頁伺服器
gulp.task('browser-sync', function () {
  browserSync.init({
    server: {
      baseDir: "./public"
    },
    reloadDebounce: 1000 //設定reload時間間隔
  });
});

// 自動監聽檔案的變更(監聽來源,任務名稱)
gulp.task('watch', function () {
  // gulp.watch('./source/**/*.html', ['copyHTML']);
  gulp.watch('./source/**/*.jade', ['jade']);
  gulp.watch('./source/scss/**/*.scss', ['sass']);
  gulp.watch('./source/js/**/*.js', ['babel']);
});

// 自動發布public到github page
gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe($.ghPages());
});

// 專案完成時的導出任務
gulp.task('build', gulpSequence('clean', 'jade', 'sass', 'babel', 'vendorJS', 'image-min'));

// 預設輸入gulp，一次啟動所有gulp任務
gulp.task('default', ['jade', 'sass', 'babel', 'vendorJS', 'image-min', 'browser-sync', 'watch']);