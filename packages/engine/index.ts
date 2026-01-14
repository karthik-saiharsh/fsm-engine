// packages/engine/src/index.ts
export class FSMEngine {
  nodes: string[] = [];

  addNode(name: string) {
    this.nodes.push(name);
    console.log(`Node ${name} added! Current count: ${this.nodes.length}`);
  }
}