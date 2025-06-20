function DisplayBlock({ src }: { src: string[] }) {
  return <div className="display-block">
    {src.map((item, index) => <div className="block-item" key={index}>{item}</div>)}
    <div className="space" />
  </div>;
}

export default DisplayBlock;
