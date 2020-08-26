function audioParamShim() {
    if (!(typeof window.AudioParam === 'undefined') && (typeof AudioParam.prototype.cancelAndHoldAtTime === 'undefined')) {
        if (typeof (AudioParam.prototype as any).cancelValuesAndHoldAtTime === 'undefined') {
            AudioParam.prototype.cancelAndHoldAtTime = function (cancelTime) {
                const audioParam = this;
                const valueAtCancelTime = audioParam.getValueAtTime(cancelTime)
                audioParam.cancelScheduledValues(cancelTime)
                audioParam.setValueAtTime(valueAtCancelTime, cancelTime)
                return this;
            }
        } else {
            // Targeting Chrome <57
            AudioParam.prototype.cancelAndHoldAtTime = (AudioParam.prototype as any).cancelValuesAndHoldAtTime;
        }
    }
}
audioParamShim();