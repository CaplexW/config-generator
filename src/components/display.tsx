function Display({ src }: { src: string[] }) {
  return <div className="diplay-container">{src.map((item) => <p className="display-item">{item}</p>)}</div>
};

export default Display;