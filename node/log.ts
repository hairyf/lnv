export const logger = {
  wait_stacks: [] as string[],
  ...console,
  wait(...data: any[]) {
    this.wait_stacks.push(...data)
  },
  don(...data) {
    data.length && console.log(...data)
    this.wait_stacks.forEach(data => console.log(data));
    this.wait_stacks = []
    console.log()
  }
}
