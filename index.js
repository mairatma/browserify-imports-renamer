var merge = require('merge');
var recast = require('recast');
var renamer = require('es6-imports-renamer');
var through = require('through');

module.exports = function(options) {
	options = options || {};

	function transform(filename) {
		var data = '';
		function write(buf) {
			data += buf;
		}

		return through(write, function() {
			var self = this;
	        var ast = recast.parse(data);
	        var sources = [ { ast: ast, path: filename } ];
	        var renamerOptions = merge({}, options, {sources: sources});
	        renamer(renamerOptions, function(error, results) {
	        	try {
					var contents = recast.print(results[0].ast);
		            self.queue(contents.code);
				} catch (error) {
					self.emit('error', error);
				}
				self.queue(null);
			});
	    });
	}

	return transform;
}
