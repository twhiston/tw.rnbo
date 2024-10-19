/** Add an amount to the current count every time a pulse is received.
 * @seealso rnbo_accum
 * @seealso counter~
 * @seealso rnbo_counter
 * @tag RNBO
 * @tag RNBO Generators
 * @category Generators
 */

@meta({
	dsponly : true,
	digest : "count incoming pulses or gates"
})
class pulse_counter extends StatefulOperator
{

	@option({ digest : "Initial value", comments : "The initial value from which to begin counting. Note that this only applies to the first count loop and only when counting is enabled at startup (reset 0), because resetting the counter~ during run time will always start counting from zero." }) init = 0;

	count = 0;

	carry : int = 0;
	carry_flag : bool = false; //carry flag persists in this version because we sometimes return early

	last : number = 0;


	@meta({
		a : { digest : "pulse train or gates in", comments : "Every time the input goes from 0.-1. 1 will be added to the count " },
		reset : { digest : "non zero value resets the count", defaultarg : 1, comments : "A non-zero value resets the counter to zero and stops counting. A zero value starts the counter." },
		limit : { digest : "count limit (zero means no limit)", defaultarg : 2, comments : "The upper limit for counting. Values above the limit are wrapped between 0 and the limit value." },
		threshold : { digest : "set the threshold at which a new trigger will be registered", defaultarg: 3, comments : "The threshold at which the gate/trigger will be registered, useful for when your signal does not hit 1." },
		out1 : { digest : "current count (running total)", comments : "The current value of the counter as a signal." },
		out2 : { digest : "carry flag (counter hit maximum)", comments : "Outputs a signal value of 1. whenever the limit value is reached, otherwise outputs a 0." },
		out3 : { digest : "carry count", comments : "The total number of times the counter~ object has reached the limit since the last reset, as a signal value. Sending a non-zero value to the middle inlet resets the carry count." }
	})
	next(a : number = 0, reset : number = 0, limit : number = 0, threshold : number = 0.99) : [ number, number, number ]
	{
		if (reset != 0) {
			this.count = 0;
			this.carry = 0;
			this.carry_flag = 0;
		}
		//Ignore negative signals
		else if(a > 0) {

			var floored = (a > threshold) ? 1 : 0;

			//only add to the count if this is a new transition
			if(floored == 1 && this.last != 1){
				this.count += floored;
			}

			this.last = floored;

			if (limit != 0) {
				if ((a > 0 && this.count >= limit) || (a < 0 && this.count <= limit)) {
					this.count = 0;
					this.carry += 1;
					this.carry_flag = 1;
				}
			}
		}

		return [ this.count, this.carry_flag, this.carry];
	}

	init() {
		this.count = options.init;
	}
}
