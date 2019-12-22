var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");

gulp.task("server", function () {
    browser({
        server: {
            baseDir: "./www/"                       //サーバー起動時のベースディレクトリ
        }
    });
});

gulp.task("html", function () {
    gulp.src("./src/index.html")                          //対象となるHTMLファイル
        .pipe(gulp.dest("./www/"))       //指定ディレクトリにCSS出力
        .pipe(browser.reload({stream: true}));  //ブラウザを更新
});

gulp.task("component", function () {
    gulp.src("./src/html/**/*.html")                          //対象となるHTMLファイル
        .pipe(gulp.dest("./www/html"))       //指定ディレクトリにCSS出力
        .pipe(browser.reload({stream: true}));  //ブラウザを更新
});

gulp.task("sass", function () {
    gulp.src("./src/sass/**/*scss")             // 対象となるSASSファイルを全部指定
        .pipe(plumber())                        //エラー時にwatchを止めない
        .pipe(sass())                           //SASSのコンパイル
        .pipe(autoprefixer())                   //CSSのベンダープレフィックス付与を自動化
        .pipe(gulp.dest("./www/css"))       //指定ディレクトリにCSS出力
        .pipe(browser.reload({stream: true}));  //ブラウザを更新
});

gulp.task("js", function() {
  gulp.src(["./src/js/**/*.js"])              // 対象となるjavaScriptファイルを全部指定
      .pipe(plumber())
      .pipe(concat('app.js'))
      // .pipe(uglify())
      .pipe(gulp.dest("./www/js/"))       //指定ディレクトリにJS出力
      .pipe(browser.reload({stream: true}));  //ブラウザを更新
});

//build
gulp.task("build", ["html", "component", "sass", "js", "server"]);

//タスクの一括実行、各ファイルの監視実行
gulp.task("default", ['build', 'server'], function () {
    gulp.watch("./src/index.html", ["html"]);
    gulp.watch("./src/html/**/*.html", ["component"]);
    gulp.watch("./src/sass/**/*scss", ["sass"]);
    gulp.watch("./src/js/**/*.js", ["js"]);
});
