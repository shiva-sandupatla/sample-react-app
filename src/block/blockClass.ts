import { BlockConfigInterface } from "./block.interface";
import { v4 } from "uuid";
import * as Blockly from "blockly";
export class Block {
  blockConfig: BlockConfigInterface;
  blockId: string;
  blockDom: HTMLElement;
  basicDeclarations = {
    COLOUR_EVENT: "#fda729", 
    COLOUR_METHOD: "#6049b1",
    COLOUR_GET: "#8bc24a",
    COLOUR_SET: "#388e3c",
    CONF_TEXT_WHEN: "when",
    CONF_TEXT_DO: "do",
    CONF_TEXT_CALL: "call",
    CONF_TEXT_SET: "set",
    CONF_TEXT_GET: "get",
  };
  constructor(
    blockDom: HTMLElement,
    { componentName, name, output, params, type }: BlockConfigInterface
  ) {
    this.blockId = v4();
    blockDom.setAttribute("id", this.blockId);
    this.blockDom = blockDom;
    var config = {
      type,
      name: name || "Name",
      params: params || [],
      output: output === true,
      componentName: componentName || "Component",
    };
    this.blockConfig = config;
    this.render();
  }
  render() {
    var { type } = this.blockConfig;
    if (type === "event") {
      this.eventBlock();
    } else if (type === "method") {
      this.methodBlock();
    } else if (type === "setter") {
      this.propertyBlock(false);
    } else if (type === "getter") {
      this.propertyBlock(true);
    }
  }
  propertyBlock(getter: boolean) {
    var { name, componentName: ComponentName } = this.blockConfig;
    var { CONF_TEXT_SET, CONF_TEXT_GET, COLOUR_SET, COLOUR_GET } =
      this.basicDeclarations;
    Blockly.Blocks["renderedBlock_" + this.blockId] = {
      init: function () {
        var input;
        if (getter) {
          input = this.appendDummyInput().appendField(CONF_TEXT_GET);
          this.setOutput(true, null);
        } else {
          input = this.appendValueInput("NAME").appendField(CONF_TEXT_SET);
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
        }
        input
          .appendField(
            new Blockly.FieldDropdown([[ComponentName, "OPTIONNAME"]]),
            "NAME"
          )
          .appendField(".")
          .appendField(
            new Blockly.FieldDropdown([[name, "OPTIONNAME"]]),
            "NAME2"
          );
        this.setColour(getter ? COLOUR_GET : COLOUR_SET);
        if (!getter) {
          input.appendField(" to ");
        }
      },
    };
    this.renderAndGetBlock(this.blockDom);
  }
  methodBlock() {
    var {
      name,
      componentName: ComponentName,
      params: param,
      output,
    } = this.blockConfig;
    var { CONF_TEXT_CALL, COLOUR_METHOD } = this.basicDeclarations;
    Blockly.Blocks["renderedBlock_" + this.blockId] = {
      init: function () {
        this.appendDummyInput()
          .appendField(CONF_TEXT_CALL)
          .appendField(
            new Blockly.FieldDropdown([[ComponentName, "OPTIONNAME"]]),
            "COMPONENT_SELECTOR"
          )
          .appendField("." + name);
        for (var i = 0; i < param.length; i++) {
          this.appendValueInput("NAME")
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(param[i]);
        }
        this.setInputsInline(false);
        if (output) {
          this.setOutput(true, null);
        } else {
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
        }
        this.setColour(COLOUR_METHOD);
      },
    };
    this.renderAndGetBlock(this.blockDom);
  }
  eventBlock() {
    var {
      componentName: ComponentName,
      name,
      params: param,
    } = this.blockConfig;
    var { CONF_TEXT_WHEN, COLOUR_EVENT, CONF_TEXT_DO } = this.basicDeclarations;
    Blockly.Blocks["renderedBlock_" + this.blockId] = {
      init: function () {
        this.appendDummyInput("")
          .appendField(CONF_TEXT_WHEN)
          .appendField(
            new Blockly.FieldDropdown([[ComponentName, "OPTIONNAME"]]),
            "COMPONENT_SELECTOR"
          )
          .appendField("." + name);
        if (param.length > 0) {
          var paramInput = this.appendDummyInput("PARAMETERS")
            .appendField("       ")
            .setAlign(Blockly.ALIGN_LEFT);
          for (var i = 0; i < param.length; i++) {
            paramInput
              .appendField(new Blockly.FieldTextInput(param[i]), "VAR" + i)
              .appendField(" ");
          }
        }
        this.appendStatementInput("DO").appendField(CONF_TEXT_DO);
        this.setInputsInline(false);
        this.setPreviousStatement(false, null);
        this.setNextStatement(false, null);
        this.setColour(COLOUR_EVENT);
      },
    };
    this.renderEventBlock(this.blockDom, param.length);
  }
  renderEventBlock(divDom: any, params_count: number) {
    var block = this.renderAndGetBlock(divDom);
    for (var i = 0; i < params_count; i++) {
      if (block.getField("VAR" + i)) {
        Blockly.utils.dom.addClass(
          // @ts-ignore
          block.getField("VAR" + i).fieldGroup_,
          "event-parameter"
        );
      }
    }
  }
  renderAndGetBlock(divDom: Element) {
    var scale = 1;
    var margin_left = 0;
    var margin_top = 0;
    var margin_right = 0;
    var margin_bottom = 1;
    var workspace = Blockly.inject(divDom, {
      trashcan: false,
      readOnly: true,
      scrollbars: false,
    });
    workspace.setScale(scale);

    var block = workspace.newBlock("renderedBlock_" + this.blockId);
    block.initSvg();
    block.moveBy(8 + margin_left, margin_top);
    block.render();

    var metrics = workspace.getMetrics();
    var b = document.getElementById(this.blockId);
    if (b) {
      b.style.height =
        metrics.contentHeight + margin_top + margin_bottom + "px";
      b.style.width =
        metrics.contentWidth + 8 + margin_left + margin_right + "px";
    }
    // $("#" + this.blockId)
    //   .height(metrics.contentHeight + margin_top + margin_bottom)
    //   .width(metrics.contentWidth + 8 + margin_left + margin_right);
    Blockly.svgResize(workspace);
    workspace.render();
    console.groupEnd();
    return block;
  }
}
