interface WaveLeftProps {
  className?: string;
}

const WaveLeft = ({ className = "" }: WaveLeftProps) => {
  return <div className={`wave-left ${className}`} />;
};

export { WaveLeft };