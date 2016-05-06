var needAuthUrls = ['/api','/private','ide']
module.exports = function(_url){
	// console.log(_url);
	// console.log(_url.search('/private'));
	// console.log(_url.search('/private')===0);
	for (var aUrl in needAuthUrls){
		if (_url.search(needAuthUrls[aUrl]) === 0) {
			//match at head
			return true
		}
	}
	return false
}