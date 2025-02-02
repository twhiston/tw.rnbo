/** Add an amount to the current count every time a pulse is received.
 * @seealso change
 * @seealso counter~
 * @seealso rnbo_counter
 * @tag RNBO
 * @tag RNBO Generators
 * @category Generators
 */

@meta({
  digest: "hold value x for n samples",
})
class hold_x_for_n extends StatefulOperator {
  counter: number = 0;
  state: boolean = false;

  @option({
    digest: "number to compare to",
    comments: "The value to compare to",
  })
  n = 0;

  @meta({
    x: { digest: "number in", comments: "number to compare" },
    time: {
      digest: "time to hold",
      comments: "time in samples to hold the value",
    },
    out1: { digest: "value", comments: "" },
  })
  next(x: number = 0, time: number = 10): number {
    //Set the hold
    if (x == options.n && this.state == false) {
      this.state = true;
      return x;
    }
    //Release the hold
    if (this.counter >= time && this.state == true) {
      this.state = false;
      this.counter = 0;
    }
    if (this.state == true) {
      this.counter++;
      return options.n;
    }

    return x;
  }

  init() {
    this.counter = 0;
  }
}
