import { ToneAudioNode, ToneAudioNodeOptions } from "./ToneAudioNode";
import { Param } from "./Param";
import { onContextClose, onContextInit } from "./ContextInitialization";
import { Context } from './Context';

export interface ListenerOptions extends ToneAudioNodeOptions{
	positionX: number;
	positionY: number;
	positionZ: number;
	forwardX: number;
	forwardY: number;
	forwardZ: number;
	upX: number;
	upY: number;
	upZ: number;
}

/**
 * Tone.Listener is a thin wrapper around the AudioListener. Listener combined
 * with [[Panner3D]] makes up the Web Audio API's 3D panning system. Panner3D allows you 
 * to place sounds in 3D and Listener allows you to navigate the 3D sound environment from
 * a first-person perspective. There is only one listener per audio context. 
 */
export class Listener extends ToneAudioNode<ListenerOptions> {

	readonly name: string = "Listener";

	/**
	 * The listener has no inputs or outputs. 
	 */
	output: undefined; 
	input: undefined; 

	readonly positionX: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.positionX,
	})

	readonly positionY: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.positionY,
	})

	readonly positionZ: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.positionZ,
	})

	readonly forwardX: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.forwardX,
	})

	readonly forwardY: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.forwardY,
	})

	readonly forwardZ: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.forwardZ,
	})

	readonly upX: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.upX,
	})

	readonly upY: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.upY,
	})

	readonly upZ: Param = new Param({
		context: this.context,
		param: this.context.rawContext.listener.upZ,
	})

	static getDefaults(): ListenerOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			positionX: 0,
			positionY: 0,
			positionZ: 0,
			forwardX: 0,
			forwardY: 0,
			forwardZ: -1,
			upX: 0,
			upY: 1,
			upZ: 0,
		});
	}

	dispose(): this {
		super.dispose();
		this.positionX.dispose();
		this.positionY.dispose();
		this.positionZ.dispose();
		this.forwardX.dispose();
		this.forwardY.dispose();
		this.forwardZ.dispose();
		this.upX.dispose();
		this.upY.dispose();
		this.upZ.dispose();
		return this;
	}
}

class PolyfillListener extends ToneAudioNode<ListenerOptions> {

	readonly name: string = "PolyfillListener";

	/**
	 * The listener has no inputs or outputs. 
	 */
	output: undefined; 
	input: undefined; 

	/**
	*  Holds the current forward orientation
	*  @type  {Array}
	*  @private
	*/
	private _orientation = [0, 0, 0, 0, 0, 0];
	
	/**
	 *  Holds the current position
	 *  @type  {Array}
	 *  @private
	 */
	private _position = [0, 0, 0];

	constructor(public context:Context) {
		super();
	}
	
	get positionX() {
		return this._position[0];
	}
	set positionX(posX) {
		this.setPosition(posX, this._position[1], this._position[2]);
	}
	get positionY() {
		return this._position[1];
	}
	set positionY(posY) {
		this.setPosition(this._position[0], posY, this._position[2]);
	}
	get positionZ() {
		return this._position[2];
	}
	set positionZ(posZ) {
		this.setPosition(this._position[0], this._position[1],posZ);
	}

	public setPosition = (x, y, z) => {
		this.context.rawContext.listener.setPosition(x, y, z);
		this._position = [x, y, z];
	}

	get forwardX() {
		return this._orientation[0]; 
	}
	set forwardX(pos) {
		this._orientation[0] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	get forwardY() {
		return this._orientation[1]; 
	}
	set forwardY(pos) {
		this._orientation[1] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	get forwardZ() {
		return this._orientation[2]; 
	}
	set forwardZ(pos) {
		this._orientation[2] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	get upX() {
		return this._orientation[3];
	}
	set upX(pos) {
		this._orientation[3] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	get upY() {
		return this._orientation[4]; 
	}
	set upY(pos) {
		this._orientation[4] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	get upZ() {
		return this._orientation[5]; 
	}
	set upZ(pos) {
		this._orientation[5] = pos;
		this.setOrientation.apply(this, this._orientation);
	}

	public setOrientation(x, y, z, upX, upY, upZ) {
		this.context.rawContext.listener.setOrientation(x, y, z, upX, upY, upZ);
		this._orientation = [x, y, z, upX, upY, upZ];
	}

	static getDefaults(): ListenerOptions {
		return Object.assign(ToneAudioNode.getDefaults(), {
			positionX: 0,
			positionY: 0,
			positionZ: 0,
			forwardX: 0,
			forwardY: 0,
			forwardZ: -1,
			upX: 0,
			upY: 1,
			upZ: 0,
		});
	}

	dispose(): this {
		super.dispose();
		(this._orientation as any) = null;
		(this._position as any) = null;
		// delete this._orientation;
		// delete this._position;
		return this;
	}
}

//-------------------------------------
// 	INITIALIZATION
//-------------------------------------

onContextInit((context) => {
	if (context.rawContext.listener.forwardX) {
		context.listener = new Listener({ context });
	} else {
		context.listener = (new PolyfillListener(context) as any as Listener);
	}
});

onContextClose(context => {
	context.listener.dispose();
});
