import type { ConfigBlock } from "../../utils/createMacRules";
import DisplayBlock from "./displayBlock";
import DisplayHeader from "./displayHeader";

function Display({ src }: { src: ConfigBlock }) {
  return <div className="diplay-container monospace-font">
    <DisplayHeader src={src.header} />
    <div className="space"></div>
    {src.blocks.map((item, index) => <DisplayBlock src={item} key={index+'display_block'} />)}
  </div>
};

export default Display;
