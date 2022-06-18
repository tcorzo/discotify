const package_json = require('./../package')

const snakeToPascal = (str: string) => { return str.split("/").map(snk => snk.split("_").map(substr => substr.charAt(0).toUpperCase() + substr.slice(1)).join("")).join("/"); };

const PLUGIN_CONFIG = {
	version: package_json.version,
	app_name: package_json.name,
	bd_app_name: snakeToPascal(package_json.name),
	author: package_json.author,
	description: package_json.description,

	port: 8443,
	play_path: '/discotify/play',
	params: {
		play_url: 'playUrl'
	}
};

export default PLUGIN_CONFIG;
