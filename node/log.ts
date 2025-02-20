export const logger = {
  wait_stacks: [] as string[],
  ...console,
  wait(...data: any[]) {
    this.wait_stacks.push(...data)
  },
  don(...data: any[]) {
    data.length && console.log(...data)
    this.wait_stacks.forEach(data => console.log(data));
    this.wait_stacks = []
  }
}
