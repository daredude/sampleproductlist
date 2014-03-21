(function(p){

	var hlp = {};
	p.hlp = hlp;

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
			if (p.XMLHttpRequest) {
	        	return new XMLHttpRequest();
		    }
		    // IE
		    if (p.ActiveXObject) {
		        return new ActiveXObject("Microsoft.XMLHTTP");
		    }
		    return null; // we should never get here
		}

		function responseHandler (successHandler, errorHandler) {
			return function () {
		    	var data;		
				if (this.readyState == 4 && this.status == 200) {
					data = JSON.parse(this.responseText);
					if (successHandler) {
						successHandler(data);
					}					
				} else if (this.status != 200) {
					this.onreadystatechange = null;
					if (errorHandler) {
						errorHandler(this.status);
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
})(window);