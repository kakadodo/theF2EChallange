const { src, dest, watch, series, parallel } = require('gulp');
//有gulp前綴的插件不用宣告的功能
var $ = require('gulp-load-plugins')();
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

//clean開發時的資料夾
function clean() {
  return src(['./public'], {
      allowEmpty: true,
      read: false
    })
    .pipe($.clean());
}

// 自動轉出html到public(沒用jade的時候可以用)
// gulp.task('copyHTML', function () {
//   return gulp.src('./source/**/*.html')
//     .pipe(gulp.dest('./public/'))
//     .pipe(browserSync.stream());
// })

function pug() {
  return src(['./source/**/*.pug', '!./source/partials/*.pug'])
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true //未壓縮
    }))
    .pipe(dest('./public/'))
    .pipe(browserSync.stream());
};

// 編譯sass格式(包含prefix、sourcemap、壓縮css功能)
function sass() {
  //設定prefix的瀏覽器範圍
  var plugins = [
    autoprefixer({
      browsers: ['last 3 version', 'ie 6-8']
    })
  ];
  return src('./source/scss/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      'includePaths': ['./node_modules/bootstrap/scss']
    }).on('error', $.sass.logError))
    .pipe($.postcss(plugins))
    .pipe($.if(process.env.NODE_ENV === 'production', $.cleanCss()))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('./public/css'))
    .pipe(browserSync.stream());
};

// 編譯JS es6格式
function babel() {
  return src('./source/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    // .pipe($.concat('all.js'))
    .pipe($.babel({
      presets: ['env']
    }))
    .pipe($.if(process.env.NODE_ENV === 'production', $.uglify({
      compress: {
        drop_console: true
      }
    })))
    .pipe($.sourcemaps.write('.'))
    .pipe(dest('./public/js'))
    .pipe(browserSync.stream());
};


function vendorJS() {
  return src(['./node_modules/jquery/dist/jquery.js', './node_modules/bootstrap/dist/js/bootstrap.bundle.js'])
    //合併前先做排序
    .pipe($.order([
      'jquery.js',
      'bootstrap.bundle.js'
    ]))
    .pipe($.concat('vendors.js'))
    .pipe($.if(process.env.NODE_ENV === 'production', $.uglify()))
    .pipe(dest('./public/js'))
};

// 圖片壓縮
function imageMin() {
  return src('./source/img/*')
    .pipe($.if(process.env.NODE_ENV === 'production', $.imagemin()))
    .pipe(dest('./public/img'))
};

// 搬移 json 檔到 public
function copyFiles() {
  return src('./source/json/**/*.json')
    .pipe(dest('./public/json'))
    .pipe(browserSync.stream());
};

// 網頁伺服器
function runBrowserSync() {
  browserSync.init({
    server: {
      baseDir: "./public"
    },
    reloadDebounce: 1000 //設定reload時間間隔
  });
};

// 自動監聽檔案的變更(監聽來源,任務名稱)
function watchFiles() {
  watch('./source/json/**/*.json', copyFiles);
  watch('./source/**/*.pug', pug);
  watch('./source/scss/**/*.scss', sass);
  watch('./source/js/**/*.js', babel);
};

// 自動發布public到github page
function deploy() {
  return src('./public/**/*')
    .pipe($.ghPages());
};

// 專案完成時的導出任務
exports.build = series(clean, pug, sass, babel, vendorJS, imageMin, copyFiles);

exports.deploy = deploy;

// 預設輸入gulp，一次啟動所有gulp任務
exports.default = parallel(pug, sass, babel, vendorJS, imageMin, copyFiles, runBrowserSync, watchFiles);