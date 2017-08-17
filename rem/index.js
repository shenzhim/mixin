(function(designWidth, rem2px) {
    var dpr = devicePixelRatio == 4 ? 2 : devicePixelRatio,
        scale = 1 / dpr,
        metaEl = document.querySelector('meta[name="viewport"]');

    if (!metaEl) {
        metaEl = document.createElement('meta');
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');

        if (document.documentElement.firstElementChild) {
            document.documentElement.firstElementChild.appendChild(metaEl);
        } else {
            var wrap = document.createElement('div');
            wrap.appendChild(metaEl);
            document.write(wrap.innerHTML);
        }
    } else {
        metaEl.setAttribute('name', 'viewport');
        metaEl.setAttribute('content', 'width=device-width,initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
    }

    var h = document.getElementsByTagName('head')[0],
        d = document.createElement('div');
    d.style.width = '1rem';
    d.style.display = "none";
    h.appendChild(d);
    var rootfs = parseFloat(getComputedStyle(d, null).getPropertyValue('width'));
    var fun = function() {
        document.documentElement.style.fontSize = document.documentElement.clientWidth / designWidth * rem2px / rootfs * 100 + '%';
    }
    fun();
    window.addEventListener("orientationchange" in window ? "orientationchange" : "resize", fun, false);
})(1080, 100)