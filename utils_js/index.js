/**
 * 对象转为url参数 
 * @param {*} obj 
 */
var objToUrlParam = function (obj) {
    var url = Object.keys(obj).reduce(function (p, n) {
        if (!obj[n]) return p;

        return p + n + '=' + encodeURIComponent(obj[n]) + '&';
    }, '?');

    return url.substr(0, url.length - 1);
}

/**
 * url参数转为对象
 */
var queryString = function () {
    var vars = {},
        hash,
        i,
        hashes = window.location.search.slice(1).split('&');

    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }

    return vars;
}

/**
 * 字符串模版解析方法
 * @param {*} 字符串模版 
 * @param {*} 填充数据
 */
var templateRender = function (str, data) {
    var pattern = /\$\{([^{}]+)\}/g;
    return str.replace(pattern, function (full, keys) {
        var temp = data;
        keys.split('.').forEach(function (key) {
            temp = temp[key];
        });
        return temp;
    });
};


