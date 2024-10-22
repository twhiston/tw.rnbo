/** Add an amount to the current count every time a pulse is received.
 * @seealso change
 * @seealso counter~
 * @seealso rnbo_counter
 * @tag RNBO
 * @tag RNBO Generators
 * @category Generators
 */

@meta({
	dsponly: true,
	digest : "bang if a number changes"
})
class trig_on_change extends StatefulOperator
{

	@option({ digest : "Initial value", comments : "The initial value from which to begin comparing." }) init = 0;

	last : number = 0;
    state : bool = false;


	@meta({
		a : { digest : "number in", comments : "number to compare to the last" },
		reset : { digest : "non zero value resets the count", defaultarg : 1, comments : "A non-zero value resets the counter to zero and stops counting. A zero value starts the counter." },
		out1 : { digest : "trig on change", comments : "will output a 1 if different from the previous input, else 0" },
		out2 : { digest : "value", comments : "pass through for the value" },
	})
	next(a : number = 0, reset : number = 0) : [ number, number ]
	{
		if (reset != 0) {
			this.last = options.init;
		}
		this.state = (a == this.last);

        this.last = a;

		return [ (this.state)?0:1, a];
	}

	init() {
		this.last = options.init;
	}
}
