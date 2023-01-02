const HTMLDEV_ONLOAD_CALLBACKS = [];
function onloadCallbacks(srcs, callback){
	if(typeof srcs === 'string') srcs = [srcs];
	HTMLDEV_ONLOAD_CALLBACKS.push([srcs, callback]);
}
window.onload = onloadCallbacks;