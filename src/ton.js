
const Wiring = require('wiring.io');

class TON {
	constructor(presetTime = 1000){
		let self = this;

		this._startTime = 0;
		this._timer = null;		
		this._action = null;
		this._args = null;
		this._currentValue = 0;
		this.isRunning = false;
		this.isRetentive = false
		this.tick = Wiring.Signal();
		this.P = 0;		
		this.Q = 0;
		
		if(typeof presetTime == 'number'){
			this.P = presetTime;
		}
		else if(typeof presetTime == 'string'){
			this.P = parseInt(presetTime, 10);
		}
		else{
			throw new TypeError('Preset time must be a number or a String')
		}

		switch(arguments.length){
			case 0:
			break;
			case 1:
			break;
			case 2:
				if(typeof arguments[1] == 'boolean'){					
					this.isRetentive = arguments[1];
				}
				else if(typeof arguments[1] == 'function'){					
					this._action = arguments[1];
				}
				else{
					throw new TypeError('second argument must be a boolean or callback function')
				}
			break;
			default:
				if(typeof arguments[1] == 'boolean'){
					this.isRetentive = arguments[1];
					if(typeof arguments[2] == 'function'){
						this._action = arguments[2];
						if(arguments.length > 3){
							this._args = Array.prototype.slice.call(arguments, 3);
						}
					}
					else{
						throw new TypeError('third argument must be a function.')
					}
				}
				else if(typeof arguments[1] == 'function'){					
					this._action = arguments[1];
					this._args = Array.prototype.slice.call(arguments, 2);												
				}
				else{
					throw new TypeError('second argument must be a boolean or a function.')
				}
			break;
		}

		Object.defineProperty(this, 'V',{
			get: function(){
				if(self.isRunning){
					return Date.now() - self._startTime + this._currentValue;
				}
				else{
					return this._currentValue;
				}
			},			
			enumerable: true,
			configurable: false
		})
	}

	Start(){
		let self = this;
		
		if(this.isRunning == false){
			this.isRunning = true
			this._startTime = Date.now();

			if(this.isRetentive == false | (this.V >= this.P)){
				this._currentValue = 0
			}
			
			this._timer = setTimeout(function(){				
				if(self._action != null){					
					if(self._args != null){						
						self._action.apply(this, self._args);
					}
					else{						
						self._action.apply(this);
					}				
				}
				self.tick.Emit();
				self.Q = true;
			},this.P-this.V);

			return this.isRunning;
		}
		else {
			return false;
		}
	}

	Stop(){
		let self = this;

		if(this.isRunning){
					

			if(this.isRetentive == true){
				this._currentValue += Date.now() - this._startTime;
			}
			else{
				this._currentValue = 0;				
			}

			this.Q = false;

			this.isRunning = false;	
			clearTimeout(this._timer);

			return this.isRunning
		}
		else{
			return false
		}
	}

	SetAction(callback){
		if(typeof callback == 'function'){
			this._action = callback;
			if(arguments.length > 1){
				this._args = Array.prototype.slice.call(arguments, 1);
			}
			else{
				this._args = null;
			}
		}
		else{
			throw new TypeError('argument must be a function');
		}
	}
}

module.exports = TON;
