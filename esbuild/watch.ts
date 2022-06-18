#!/usr/bin/env ts-node

import { copyFileSync } from 'fs';
import { join } from 'path';
import { build, BuildOptions } from 'esbuild';
const bd_dir = process.cwd() + '/bd';
const spicetify_dir = process.cwd() + '/spicetify';

import config from '../config/plugin_config';

const bd_outfile = `${config.bd_app_name}.plugin.js`;
const sp_outfile = `${config.app_name}.js`;

const BD_BUILD_CONFIG: BuildOptions = {
	platform: 'node',
	entryPoints: ['src/zeres_wrapper.ts'],
	outfile: `build/${bd_outfile}`,
	absWorkingDir: bd_dir,
	bundle: true,
	loader: { '.ts': 'ts' },
	external: ['request', 'electron'],
	banner: {
		js: generateMetaBanner(true),
	},
	footer: { js: '/*@end@*/' },
	watch: {
		onRebuild(error, _) {
			if (error) console.error('watch build failed:', error);
			else {
				copyToBD();
				console.log('⚡ Built & copied BetterDiscord plugin!');
			}
		},
	},
};

const SP_BUILD_CONFIG: BuildOptions = {
	platform: "node",
	entryPoints: ['src/discotify.ts'],
	outfile: `build/${sp_outfile}`,
	absWorkingDir: spicetify_dir,
	bundle: true,
	loader: { '.ts': 'ts' },
	banner: {
		js: generateMetaBanner(),
	},
	footer: { js: '//@end' },
	watch: {
		onRebuild(error, _) {
			if (error) console.error('watch build failed:', error);
			else console.log('⚡ Built Spicetify extension!');
		},
	},
};

function copyToBD() {
	if (!BD_BUILD_CONFIG.outfile)
		return

	let fromDir = join(bd_dir, BD_BUILD_CONFIG.outfile);
	let toDir = join(
		'%APPDATA%\\BetterDiscord\\plugins',
		bd_outfile
	);
	copyFileSync(fromDir, toDir);
}

function generateMetaBanner(isBD = false) {
	return (
		'/**\n' +
		`* @name ${isBD ? config.bd_app_name : config.app_name}\n` +
		`* @version ${config.version}\n` +
		`* @description ${config.description}\n` +
		`* @author ${config.author}\n` +
		'*/'
	);
}

build(BD_BUILD_CONFIG)
	.then(copyToBD)
	.then(() => console.log('⚡ Done first build!'))
	.catch(() => process.exit(1));

build(SP_BUILD_CONFIG)
	.then(() => console.log('⚡ Done first build!'))
	.catch(() => process.exit(1));
