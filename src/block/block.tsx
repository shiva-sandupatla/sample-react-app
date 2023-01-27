import React, { Component } from "react";
import { BlockConfigInterface } from "./block.interface";
import { Block } from "./blockClass";
export default class BlocklyComponent extends Component {
  props: Readonly<BlockConfigInterface>;
  blocklyDiv: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.props = props;
    this.state = {};
    this.blocklyDiv = React.createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    var dom = this.blocklyDiv.current;
    if (dom) {
      dom.innerHTML = "";
      dom.style.display = "block";
      new Block(dom, this.props);
    }
  }
  render() {
    return (
      <div ref={this.blocklyDiv} style={{ marginBottom: 7 }}>
        <p>loading block...</p>
      </div>
    );
  }
}
