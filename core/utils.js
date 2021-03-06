
/**
 * Returns true if the object passed is a window instance
 * From jQuery
 * @param  {*}       obj
 * @return {Boolean}
 */

export function isWindow(obj) {
  return typeof obj === 'object' && obj.window;
}

/**
 * Gets a window from an element
 * From jQuery
 */

export function getWindow( elem ) {
  return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

/**
 * Returns the elements offset left and top relative to the document
 * From jQuery
 * @param  {Element} element
 * @return {Object}
 */

export function getElementOffset(element) {
  let rect;

  // Support: IE <=11 only
  // Running getBoundingClientRect on a
  // disconnected node in IE throws an error
  if ( ! element.getClientRects().length) {
    return { top: 0, left: 0 };
  }

  rect = element.getBoundingClientRect();

  // Make sure element is not hidden (display: none)
  if (rect.width || rect.height) {
    let doc = element.ownerDocument;
    let win = getWindow( doc );
    let docElem = doc.documentElement;

    return {
      top: rect.top + win.pageYOffset - docElem.clientTop,
      left: rect.left + win.pageXOffset - docElem.clientLeft
    };
  }

  // Return zeros for disconnected and hidden elements (gh-2310)
  return rect;
}


/**
 * Returns a promise which resolves when the image has loaded and
 * rejects when the image fails to load.
 *
 * @param {String}  url
 */
export function preloadImage(url) {
	return new Promise((resolve, reject) => {
		const image = document.createElement('img');

		image.src = url;

		image.addEventListener('load', function onImageLoaded(event) {
			this.removeEventListener('load', onImageLoaded);
			resolve({ url, img: image });
		});

		image.addEventListener('error', function onImageLoadError(event) {
			this.removeEventListener('error', onImageLoadError)
			reject(new Error('Could not load image'));
		});
	});
}
