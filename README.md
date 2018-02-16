# ton
A TON plc based timer for javascript.

The TON (On-Delay Timer) type of timer is used to control on-delay actions. When the Timer start, it wait a preset period of time to turn on is output.

## Installation

```bash
$ npm install plc-ton --save
```

## Basic Usage

```js
const Ton = require('plc-ton');
const Wiring = require('wiring.io');

var myTimer = new Ton(1000, function(){
		console.log('1s');
	})

myTimer.Start();
```

## TON constructor([preset [, retentive [, callback [, ...args]]]])

* preset {number | string}
* retentive {boolean}
* callback {function}
* args 

**preset** Defines the preset value for the timer in ms. Default is 1000 (1s).

**retentive** Set true or false the retentive behavior. When the retentive is false (default), the property Ton.V is reset when Ton.Stop is called. Counting restarts from 0.
When the retentive is true, the timer retains its value when Ton.Stop is called before the Preset value is reached. Counting restarts from this value.

**callback** Function to call when the preset value is reached.

**args** arguments to pass to a callback function.


```js
let timer1 = new Ton();
//timer whit preset value of 1,5s and retentive behavior
let timer2 = new Ton(1500, true);
//timer whit preset value of 500ms and a callback functions whit argument
let timer3 = new Ton('500', Foo, 'running');
```

## Timer Atributes

### `isRetentive`

Type: {boolean}

Indicate the retentive behavior of the timer. See retentive description on constructor secction.

### `isRunning`

Type: {boolean}

Indicate the running status of the timer.

### `P`

Type: {number}

Indicate the preset value of the timer.

### `Q`

Type: {boolean}

Timer output. Indicate the preset value was reached.

### `tick`

Type: {Wiring.Signal}

A signal that is emited by timer when the preset value was reached.
See wiring.io for mor details about signal and slots.

### `V`

Type: {number}

Value that increments from 0 to the preset value timer.P when the timer is running. The value can be read and tested, but not written to

## Timer Methods

### `Start()`

Start the timer. Similar to put in true the in input of a plc's ton timer. Returns a `Boolean` indicating whether or not the timer was started.

```js
let timer1 = new Ton(2000)
timer1.Start() //  true - the timer started

setTimeout(function(){
		timer1.start() //  false - the timer is already started
	}, 1000);

```

### `Stop()`

Stop or pause (depents of retentive behavior) a timer. Similar to the `start()`
method, `Stop()` returns a `Boolean` indicating whether or not the timer was
stopped.

```js
let timer1 = new Ton(2000)
timer1.Stop() // false - the timer is already stopped
timer1.Start() //  true - the timer started
timer1.Stop() // true - the timer stopped
```

### `SetAction(callback [, ...args])`

Set a callback function to call when the preset value is reached. The callback function will be called whit the aruments passed to SetAcction.

```js
function Report(action, date1){
	console.log(action + ': ' + (Date.now() - date1));
}
let timer1 = new Ton(2000)
timer1.SetAction(Report, 'Total Time', Date.now());
timer1.Start()
//Total Time: 2000

```


## Development

Pull requests are welcome.

### Get the code

```bash
$ git clone https://github.com/hsocarras/ton.git
```

### Install the dependencies

```bash
$ npm install
```

### Run the tests

```bash
$ npm test
```

### Contributing

If you have a suggestion or found a issue, let us known and [create an issue](https://github.com/hsocarras/ton/issues)

## License

This project is licensed under the MIT License - see the LICENSE.md file for details