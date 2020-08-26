function offlineContextShim() {
    if (!window.hasOwnProperty("OfflineAudioContext") && window.hasOwnProperty("webkitOfflineAudioContext")){
        (window as any).OfflineAudioContext = (window as any).webkitOfflineAudioContext;
    }
    //returns promise?
    const context = new OfflineAudioContext(1, 1, 44100);
    var ret = context.startRendering();
    if (!(ret && typeof ret.then === 'function')){
        (OfflineAudioContext.prototype as any)._native_startRendering = OfflineAudioContext.prototype.startRendering;
        OfflineAudioContext.prototype.startRendering = function(){
            return new Promise(function(done){
                this.oncomplete = function(e){
                    done(e.renderedBuffer);
                };
                this._native_startRendering();
            }.bind(this));
        };
    }
}
offlineContextShim();