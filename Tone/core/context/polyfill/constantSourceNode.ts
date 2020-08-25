import { AnyAudioContext } from '../AudioContext';
import { InputNode, connect, OutputNode, disconnect } from '../ToneAudioNode';

export class PolyfillConstantSourceNode {

    readonly  name = 'PolyfillConstantSourceNode';
    private _bufferSource!:AudioBufferSourceNode;
    public output:AudioNode;
    public offset:AudioParam;

    private _sourceStarted = false;
    private _sourceStopped = false;
    private _buffer:AudioBuffer;

    constructor(public context:AnyAudioContext) {
        this._buffer = context.createBuffer(1, 128, context.sampleRate);
		var arr = this._buffer.getChannelData(0);
		for (var i = 0; i < arr.length; i++){
			arr[i] = 1;
		}
		const gainNode = this.output = context.createGain();
        this.offset = gainNode.gain;
        this.createNewBufferSource();
    }

    private createNewBufferSource() {
        this._bufferSource = this.context.createBufferSource();
		this._bufferSource.channelCount = 1;
		this._bufferSource.channelCountMode = "explicit";
		this._bufferSource.buffer = this._buffer;
		this._bufferSource.loop = true;
		this._bufferSource.connect(this.output);
    }

    get numberOfInputs() {
        return 0;
    }

    get numberOfOutputs() {
        return this.output.numberOfOutputs;
    }

    public start = (time) => {
        if (this._sourceStopped) {
            this.createNewBufferSource();
            this._sourceStopped = false;
        }
        this._bufferSource.start(time);
        this._sourceStarted = true;
        return this;
    }

    public stop = (time) => {
        if (this._sourceStarted && !this._sourceStopped) {
            this._bufferSource.stop(time);
            this._sourceStopped = true;
            this._sourceStarted = false;
        }
        return this;
    }

    public connect = (destination: InputNode, outputNum = 0, inputNum = 0) => {
        connect(this.output, destination, outputNum, inputNum);
        return this;
    }

    public disconnect = (destination?: InputNode, outputNum = 0, inputNum = 0) => {
        disconnect(this.output, destination, outputNum, inputNum);
        return this;
    }
}