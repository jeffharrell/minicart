'use strict';


var Storage = module.exports = function Storage(name, duration) {
    this._name = name;
    this._duration = duration || 30;
};


var proto = Storage.prototype;


proto.load = function () {
    if (typeof window === 'object' && window.localStorage) {
        var data = window.localStorage.getItem(this._name), today, expires;

        if (data) {
            data = JSON.parse(decodeURIComponent(data));
        }

        if (data && data.expires) {
            today = new Date();
            expires = new Date(data.expires);

            if (today > expires) {
                this.destroy();
                return;
            }
        }

        return data && data.value;
    }
};


proto.save = function (data) {
    if (typeof window === 'object' && window.localStorage) {
        var expires = new Date(), wrapped;

        expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

        wrapped = {
            value: data,
            expires: expires.toGMTString()
        };

        window.localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrapped)));
    }
};


proto.destroy = function () {
    if (typeof window === 'object' && window.localStorage) {
        window.localStorage.removeItem(this._name);
    }
};
