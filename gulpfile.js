import path from 'path';
import gulp from 'gulp';
import gzip from 'gulp-zip';
import sync from 'browser-sync';
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import postcss from 'gulp-postcss';
import cssnano from 'cssnano';
import autoprefixer from 'autoprefixer';
import postcssPresetEnv from 'postcss-preset-env';
import * as del from 'del';

// Configurations
const config = {
	name: path.basename(process.cwd()),
	mode: {
		isDev: !process.argv.includes('--production'),
		isProd: process.argv.includes('--production'),
	},
	sourceDir: 'src',
	outputDir: 'dist',
	publicDir: 'public',
};

// Task handle styles
function handleStyles() {
	const outputDir = `${config.sourceDir}/assets/styles`;
	const sourceDir = `${config.sourceDir}/assets/styles`;

	const autoprefixerConfig = {
		grid: true,
	};

	const postcssPreset = {
		features: {
			['nesting-rules']: {
				noIsPseudoSelector: false,
			},
		},
	};

	const postcssConfig = [postcssPresetEnv(postcssPreset), autoprefixer(autoprefixerConfig)];

	return gulp
		.src([`${sourceDir}/**/*.css`, `!${sourceDir}/**/*.min.css`], { sourcemaps: config.mode.isDev })
		.pipe(postcss(postcssConfig))
		.pipe(gulp.dest(`${outputDir}/`))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([cssnano()]))
		.pipe(gulp.dest(`${config.mode.isProd ? outputDir : sourceDir}/`, { sourcemaps: true }))
		.pipe(sync.stream());
}

// Task handle scripts
function handleScripts() {
	const outputDir = `${config.outputDir}/assets/scripts`;
	const sourceDir = `${config.sourceDir}/assets/scripts`;

	const babelConfig = {
		presets: [
			[
				'@babel/preset-env',
				{
					useBuiltIns: 'entry',
					corejs: '3.22',
				},
			],
		],
	};

	const terserConfig = {
		keep_fnames: true,
		mangle: false,
	};

	const renameConfig = {
		suffix: '.min',
	};

	return gulp
		.src([`${sourceDir}/**/*.js`, `!${sourceDir}/**/*.min.js`], { sourcemaps: config.mode.isDev })
		.pipe(babel(babelConfig))
		.pipe(gulp.dest(`${outputDir}/`))
		.pipe(terser(terserConfig))
		.pipe(rename(renameConfig))
		.pipe(gulp.dest(`${config.mode.isProd ? outputDir : sourceDir}/`, { sourcemaps: true }))
		.pipe(sync.stream());
}

// Task handle copying
function handleCopying() {
	return gulp
		.src([`${config.publicDir}/**/*.*`, `${config.sourceDir}/**/*.*`], {
			encoding: false,
			ignore: `${config.sourceDir}/assets/{styles,scripts}/**/*.*`,
		})
		.pipe(gulp.dest(`${config.outputDir}/`));
}

// Task handle archive
function handleArchive() {
	return gulp
		.src(`${config.outputDir}/**/*`)
		.pipe(gzip(`${config.name}.zip`))
		.pipe(gulp.dest('.'));
}

// Task run Clean
function runClean(out) {
	del.deleteSync(`${config.outputDir}/*`);
	del.deleteSync(`${config.name}.zip`);

	out();
}

// Task run watcher
function runWatcher() {
	gulp
		.watch([`${config.sourceDir}/**/*.*`, `!${config.sourceDir}/assets/{styles,scripts}/**/*.*`])
		.on('change', sync.reload);

	gulp
		.watch([`${config.sourceDir}/assets/styles/**/*.css`, `!${config.sourceDir}/assets/styles/**/*.min.css`])
		.on('change', handleStyles);

	gulp
		.watch([`${config.sourceDir}/assets/scripts/**/*.js`, `!${config.sourceDir}/assets/scripts/**/*.min.js`])
		.on('change', handleScripts);
}

// Task run server
function runServer() {
	sync.init({
		server: {
			baseDir: config.mode.isProd ? [config.outputDir] : [config.publicDir, config.sourceDir],
		},
		notify: false,
		online: false,
		open: config.mode.isProd,
		port: config.mode.isProd ? 8080 : 1234,
		ui: false,
	});
}

// Gulp scripts:
export const clean = gulp.series(runClean);
export const build = gulp.series(runClean, handleStyles, handleScripts, handleCopying);
export const preview = gulp.series(runClean, handleStyles, handleScripts, handleCopying, runServer);
export const archive = gulp.series(runClean, handleStyles, handleScripts, handleCopying, handleArchive);

// Gulp default script:
export default gulp.series(runClean, gulp.parallel(handleStyles, handleScripts), gulp.parallel(runServer, runWatcher));
