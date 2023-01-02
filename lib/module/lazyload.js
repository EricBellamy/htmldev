const readJavascriptFile = require(__htmldev_root + '/lib/module/readJavascriptFile.js');
module.exports = {
	pre: async function(){
		return `<script>${await readJavascriptFile(__htmldev_root + '/lib/module/lazy/onload.js', true)}</script>`;
	},
	post: async function(LAZY_URLS){
		return `<script>const HTMLDEV_LAZY_URLS=${JSON.stringify(LAZY_URLS)}; ${await readJavascriptFile(__htmldev_root + '/lib/module/lazy/loader.js', true)}</script>`;
	},
}