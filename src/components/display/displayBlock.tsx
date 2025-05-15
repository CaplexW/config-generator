function DisplayBlock({ src }: { src: string[] }) {
  return <div className="display-block">{src.map((item) => <div className="block-item">{item}</div>)}</div>;
}

export default DisplayBlock;
