/** Synch a value to a trigger
 * @seealso rnbo_accum
 * @seealso counter~
 * @seealso rnbo_counter
 * @tag RNBO
 * @tag RNBO Generators
 * @category Generators
 */

@meta({
	dsponly : true,
	digest : "sync a value to a trigger"
})
class value_sync extends StatefulOperator
{

	@option({ digest : "Initial value", comments : "The initial value from which to begin counting. Note that this only applies to the first count loop and only when counting is enabled at startup (reset 0), because resetting the counter~ during run time will always start counting from zero." }) init = 0;

	triggered : bool = false;

	@meta({
		a : { digest : "value to sync", comments : "" },
		b : { digest : "trigger"},
		threshold : { digest : "set the threshold at which a new trigger will be registered", defaultarg: 1, comments : "The threshold at which the gate/trigger will be registered, useful for when your signal does not hit 1." },
		out1 : { digest : "value", comments : "triggered value or 0" },
})
	next(a : number = 0, b : number = 0, threshold : number = 0.99) : [ number ]
	{
		if(this.triggered == true){
			this.triggered = false;
			return [0];
		}
		let out = 0;
		if(b >= threshold){
			out = a;
			this.triggered = true;
		}
		return [out];
	}

	init() {

	}
}
