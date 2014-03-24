(function(window){

	var hlp = {};
	window.hlp = hlp;

	/*
		helper functions for using with urls
	*/
	hlp.url = (function() {
		
		/*
			transforms an object (key/value pairs) into a url query
		*/
		function buildQuery (params) {
			var parts = [];
			for (var prop in params) {
	      		if(params.hasOwnProperty(prop)){
	      			parts.push(prop + "=" + params[prop]);
				}
			}
			return "?" + parts.join('&');
		}

		return {
			buildQuery: buildQuery
		};
	})();

	/*
		helper functions for using json services
	*/
	hlp.json = (function() {

		function requestFactory() {
			if (window.XMLHttpRequest) {
	        	return new XMLHttpRequest();
		    }
		    // IE
		    if (window.ActiveXObject) {
		        return new ActiveXObject("Microsoft.XMLHTTP");
		    }
		    return null; // we should never get here
		}

		function responseHandler (successHandler, errorHandler) {
			return function () {
		    	var data;		
				if (this.readyState == 4) {
					if (this.status != 200) {
						this.onreadystatechange = null;
						if (errorHandler) {
							errorHandler(this.status);
						}
					} else {
						data = JSON.parse(this.responseText);
						if (successHandler) {
							successHandler(data);
						}	
					}										
				}
		    };
		}

		function sendRequest(method, opts) {
			var request = requestFactory();
			request.open(method, opts.url, true);
		    request.onreadystatechange = responseHandler(opts.success, opts.error);
		    request.send(null);
		}

		function get (opts) {
			sendRequest('GET', opts);
		}

		function post (opts) {
			sendRequest('POST', opts);	
		}

		return {
			get: get,
			post: post
		};
	})();

	hlp.events = (function() {

		function bind (src, name, callback) {
			if (src.addEventListener) {
			  src.addEventListener(name, callback, false); 
			} else if (src.attachEvent)  {
			  if (name == 'DOMContentLoaded'){
			  	window.attachEvent('onload', callback); // IE<9
			  } else {
			  	src.attachEvent('on' + name, callback);			  	
			  }
			}
		}

		function unbind (src, name, callback) {
			if (src.removeEventListener) {
			  src.removeEventListener(name, callback); 
			} else if (src.detachEvent)  {
				if (name == 'DOMContentLoaded'){
			  	window.detachEvent('onload', callback); // IE<9
			  } else {
			  	src.detachEvent('on' + name, callback);
			  }
			}
		}		

		return {
			bind: bind,
			unbind: unbind
		};
	})();
})(window);