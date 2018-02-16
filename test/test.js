const Ton = require('../');
const Wiring = require('wiring.io');

class controller {
	constructor(name){
		this.name = name;
		this.count = 0;
		this.timer1 = new Ton();
		this.timer2 = new Ton(1500, true);
		this.timer3 = new Ton('500', this.Stat.bind(this), 'running');
		

		this.slot1 = Wiring.Slot(this);
	}

	Stat(status){
		console.log(this.name + ' is ' + status);
	}

	Add(){
		this.count++;
	}

}

function Report(action, date1){
	console.log(action + ': ' + (Date.now() - date1));
}

let plc1 = new controller('plc1');
let plc2 = new controller('plc2');

plc2.slot1.SetChannel('0', function(){
	this.Add()
});
plc2.slot1.SetChannel('1', function(){
	console.log(this.count);
});

Wiring.Connect(plc1.timer1.tick, plc2.slot1, '0');
Wiring.Connect(plc1.timer2.tick, plc2.slot1, '1');

plc1.timer1.P = 1500;
plc1.timer2.P = 10000;
plc1.timer2.SetAction(Report, 'Total Time', Date.now());

plc1.timer3.Start();
plc1.timer1.Start();
plc1.timer2.Start();


setTimeout(function(){	
	plc1.timer2.Stop();
	console.log(plc1.timer2.V)
}, 5000);

setTimeout(function(){		
	plc1.timer2.Start();
}, 10000);



