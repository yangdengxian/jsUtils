var Ydx_JsUtil = {};
var NODE_TYPE_ELEMENT = 1;
var NODE_TYPE_TEXT = 3;
var NODE_TYPE_COMMENT = 8;
var NODE_TYPE_DOCUMENT = 9;
var NODE_TYPE_DOCUMENT_FRAGMENT = 11;

Ydx_JsUtil.isUndefined = function(value) {
	return typeof value === undefined;
};

Ydx_JsUtil.isDefined = function(value) {
	return typeof value !== undefined;
};

Ydx_JsUtil.isObject = function(value) {
	return value !== null && typeof value === "object";
};

Ydx_JsUtil.isArray = function(value) {
	return value instanceof Array;
};

/**
 * @private
 * @param {*} obj
 * @return {boolean} Returns true if `obj` is an array or array-like object (NodeList, Arguments,
 *                   String ...)
 */
Ydx_JsUtil.isArrayLike = function(obj) {
  if (obj == null || Ydx_JsUtil.isWindow(obj)) {
    return false;
  }

  var length = obj.length;

  if (obj.nodeType === NODE_TYPE_ELEMENT && length) {
    return true;
  }

  return Ydx_JsUtil.isString(obj) || Ydx_JsUtil.isArray(obj) || length === 0 ||
         typeof length === 'number' && length > 0 && (length - 1) in obj;
};

Ydx_JsUtil.isFuntion = function(value) {
	return typeof value === "function";
};

Ydx_JsUtil.isRegExp = function(value) {
	return toString.call(value) === "[object RegExp]";
};

Ydx_JsUtil.isString = function(value) {
	return typeof value === "string";
};

Ydx_JsUtil.isNumber = function(value) {
	return typeof value === "number";
};

Ydx_JsUtil.isDate = function(value) {
	return toString.call(value) === "[object Date]";
};


/**
 * Checks if `obj` is a window object.
 *
 * @private
 * @param {*} obj Object to check
 * @returns {boolean} True if `obj` is a window obj.
 */
Ydx_JsUtil.isWindow = function(obj) {
	//I think it's a error here ,has window in obj ??? maybe it's window.obj, but it's the same as jQuery 2.1.4,if you see it ,please tell me what about,thank you!
	//我觉得这里有个错误，obj没有window对象，个人觉得应该是window.obj,但是在jQuery 2.1.4中也是obj.window,可能是个人知识有限，无法理解，如果你看到这段代码，请给我留言，万分感谢
  return obj && obj.window === obj;
  //return obj && window.obj === obj;
};


Ydx_JsUtil.isFile = function(obj) {
  return toString.call(obj) === '[object File]';
};


Ydx_JsUtil.isBlob = function(obj) {
  return toString.call(obj) === '[object Blob]';
};


Ydx_JsUtil.isBoolean = function(value) {
  return typeof value === 'boolean';
};


Ydx_JsUtil.isPromiseLike = function(obj) {
  return obj && Ydx_JsUtil.isFunction(obj.then);
};


Ydx_JsUtil.trim = function(value) {
  return Ydx_JsUtil.isString(value) ? value.trim() : value;
};

Ydx_JsUtil.isElement = function(node) {
	return !!(node &&
	    (node.nodeName  // we are a direct element
	    || (node.prop && node.attr && node.find)));  // we have an on and find method part of jQuery API
};

Ydx_JsUtil.makeMap = function(obj) {

};

//--------ArrayLike-----
/**
 * @description
 * Determines the number of elements in an array, the number of properties an object has, or
 * the length of a string.
 *
 * Note: This function is used to augment the Object type in Angular expressions. See
 * {@link angular.Object} for more information about Angular arrays.
 *
 * @param {Object|Array|string} obj Object, array, or string to inspect.
 * @param {boolean} [ownPropsOnly=false] Count only "own" properties in an object
 * @returns {number} The size of `obj` or `0` if `obj` is neither an object nor an array.
 */
Ydx_JsUtil.size = function(obj,ownPropsOnly) {
	var count = 0, key;
	if (Ydx_JsUtil.isString(obj) || Ydx_JsUtil.isArray(obj)) {
		return obj.length;
	} else if (Ydx_JsUtil.isObject(obj)) {
		for (key in obj) {
			if (!ownPropsOnly || obj.hasOwnProperty(key)) {
				count ++;
			}
		}
	}
	return count;
};

Ydx_JsUtil.arrayRemove = function(array,value) {
	var index = array.indexOf(value);
	if (index > -1) {
		array.splice(index,1);
	}
	return array;
};

/**
 * @ngdoc function
 * @name angular.forEach
 * @module ng
 * @kind function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection, which can be either an
 * object or an array. The `iterator` function is invoked with `iterator(value, key, obj)`, where `value`
 * is the value of an object property or an array element, `key` is the object property key or
 * array element index and obj is the `obj` itself. Specifying a `context` for the function is optional.
 *
 * It is worth noting that `.forEach` does not iterate over inherited properties because it filters
 * using the `hasOwnProperty` method.
 *
   ```js
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.forEach(values, function(value, key) {
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender: male']);
   ```
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {Function} iterator Iterator function.
 * @param {Object=} context Object to become context (`this`) for the iterator function.
 * @returns {Object|Array} Reference to `obj`.
 */

Ydx_JsUtil.forEach = function(obj, iterator, context) {
  var key, length;
  if (obj) {
    if (Ydx_JsUtil.isFunction(obj)) {
      for (key in obj) {
        // Need to check if hasOwnProperty exists,
        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
        if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (Ydx_JsUtil.isArray(obj) || Ydx_JsUtil.isArrayLike(obj)) {
      var isPrimitive = typeof obj !== 'object';
      for (key = 0, length = obj.length; key < length; key++) {
        if (isPrimitive || key in obj) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
        obj.forEach(iterator, context, obj);
    } else {
      for (key in obj) {
        if (obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key, obj);
        }
      }
    }
  }
  return obj;
};

Ydx_JsUtil.sortedKeys = function(obj) {
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }
  return keys.sort();
};
/**
 * 判断属性是否存在原型中 返回true表示在原型中
 */
Ydx_JsUtil.hasPrototypeProperty = function(object,name) {
  return !object.hasOwnProperty(name) && (name in object);
};
//test nodeJS
console.log(Ydx_JsUtil.forEach({d:2,b:1,c:4,a:3}));


