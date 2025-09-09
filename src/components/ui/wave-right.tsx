interface WaveRightProps {
  className?: string;
}

const WaveRight = ({ className = "" }: WaveRightProps) => {
  return <div className={`wave-right ${className}`} />;
};

export { WaveRight };