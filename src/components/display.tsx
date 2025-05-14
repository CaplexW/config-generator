function Display({ src }: { src: string[] }) {
  return <div className="diplay-container">{src.map((item, index) => <div key={index} className="display-item">{item}</div>)}</div>
};

export default Display;