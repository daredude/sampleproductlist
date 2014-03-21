(function(window){

	var document = window.document,
		hlp = window.hlp,
		settings = {
				// amount of items to load per request
				chunkSize: 20,
				// service endpoint that returns a list of products
				dataService: 'products.php',
				// service endpoint for images
				imgService: 'image.php',
				// service endpoint for cart
				cartService: 'cart.php',
				blankImg: 'img/blank.png'
		},
		// root DOM element for product list
		listNode,
		// DOM elements for cloning a product 
		productTemplate = buildProductTemplate(),
		// the overlay, shown when something was added to the cart
		overlayElement = buildOverlay(),
		// the lightbox, shown when something was added to the cart
		lightBoxElement = buildLightBox(),
		// amount of data loaded from service
		dataCount,		
		// the images, not loaded yet
		lazies = [],
		// cartToken is hard coded for simplicity. it can be set (i.e.) via cookie or url
		cartToken = '12345';

	function init (e) {

		unbind(document, 'DOMContentLoaded', 'load', init);

		bind(window, 'scroll', 'onscroll', lazyLoadHandler);
		bind(window, 'resize', 'onresize', lazyLoadHandler);

		listNode = document.getElementById('productList');
		dataCount = 0;

		requestData();
	}

	function buildProductTemplate () {
		var listElement, imgElement, titleElement, priceElement, btnElement;
		listElement = document.createElement('li');
		imgElement = document.createElement('img');
		imgElement.src = settings.blankImg;
		titleElement = document.createElement('span');
		titleElement.setAttribute('class', 'title');
		priceElement = document.createElement('span');
		priceElement.setAttribute('class', 'price');
		btnElement = document.createElement('button');
		btnElement.appendChild(document.createTextNode('Add to cart'));
		listElement.appendChild(imgElement);
		listElement.appendChild(titleElement);
		listElement.appendChild(priceElement);
		listElement.appendChild(btnElement);
		return listElement;
	}

	function buildOverlay () {
		var overlayElement = document.createElement("div");
		overlayElement.setAttribute('id', 'overlay');
		bind(overlayElement, 'click', 'onclick', hideOverlay);
		return overlayElement;
	}

	function buildLightBox () {
		var lightboxElement = document.createElement("div");
		lightboxElement.setAttribute('id', 'lightBox');
		return lightboxElement;
	}

	function showError (status) {
		// TODO error handling (i.e. if service not available)
		alert('error: ' + status);
	}

	function  requestData() {
		var url = settings.dataService + hlp.url.buildQuery({
				skip: dataCount, 
				take: settings.chunkSize
			});
		hlp.json.get({
			url: url,
			success: showData,
			error: showError
		});
	}	

	function showData(data) {
		var chunk, product;
		
		if (data.length > 0) {

			chunk = document.createDocumentFragment();
			
			for (var i = 0; i < data.length; i++) {
				product = productTemplate.cloneNode(true);
				product.childNodes[1].appendChild(document.createTextNode(data[i].name)); // display product name
				product.childNodes[2].appendChild(document.createTextNode(data[i].price)); // display product name
				bind(product.childNodes[3], 'click', 'onclick', buyHandler) // bind buy button click event
				product.setAttribute('data-id', dataCount + i);
				lazies.push(product);
				chunk.appendChild(product);
			};			
			chunk.lastChild.setAttribute('loadingTrigger', true);
			dataCount += data.length;
			listNode.appendChild(chunk);
			lazyLoadHandler();
		}else{
			unbind(window, 'scroll', 'onscroll', lazyLoadHandler);
			unbind(window, 'resize', 'onresize', lazyLoadHandler);
		}
	}

	function isVisible(element) {
	    var rect = element.getBoundingClientRect();
	    return (
			rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) 	
	    );
	}

	function lazyLoadHandler() {
		var id, element, img;

		if (lazies.length > 0) {
			for (var i = 0; i < lazies.length; i++) {
				element = lazies[i];			
				if (isVisible(element)) {
					id = element.getAttribute('data-id');
					img = element.firstChild; 
					img.src = settings.imgService + hlp.url.buildQuery({id: id});
					lazies.splice(i,1);
					i--;

					if (element.getAttribute('loadingTrigger')) {
						requestData();
					}
				}
			};
		}		
	}

	function buyHandler () {
		var url = settings.cartService + hlp.url.buildQuery({
				token: cartToken, 
				id: this.parentNode.getAttribute('data-id')
			}),
			productName = this.parentNode.childNodes[1].innerText;
		hlp.json.post({
			url: url,
			success: showOverlay(productName),
			error: showError
		});
	}

	function showOverlay(productName) {
		return function (data) {
			var msg, bodyElement;

			if (data.result) {
				msg = productName + ' added to cart.';
			} else {
				msg = data.result; // TODO map error responses to display messages
			}

			if (lightBoxElement.firstChild) {
				lightBoxElement.removeChild(lightBoxElement.firstChild);
			}
			lightBoxElement.appendChild(document.createTextNode(msg));

			bodyElement = document.getElementsByTagName("body")[0];
			bodyElement.appendChild(overlayElement);
			bodyElement.appendChild(lightBoxElement);			
		};
	}

	function hideOverlay() {
		bodyElement = document.getElementsByTagName("body")[0];
		bodyElement.removeChild(overlayElement);
		bodyElement.removeChild(lightBoxElement);
	}

	bind(document, 'DOMContentLoaded', 'onload', init);

	function bind (src, name, ieName, callback) {
		if (src.addEventListener) {
		  src.addEventListener(name, callback, false); 
		} else if (src.attachEvent)  {
		  src.attachEvent(ieName, callback);
		}
	}

	function unbind (src, name, ieName, callback) {
		if (src.removeEventListener) {
		  src.removeEventListener(name, callback); 
		} else if (src.detachEvent)  {
		  src.detachEvent(ieName, callback);
		}
	}		

})(window);

