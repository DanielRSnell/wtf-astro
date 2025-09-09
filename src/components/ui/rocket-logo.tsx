interface RocketLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const RocketLogo = ({ className = "", size = "md" }: RocketLogoProps) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20 md:w-24 md:h-24", 
    lg: "w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32"
  };

  return (
    <div className={`avatar ${sizeClasses[size]} ${className}`} style={{
      width: size === "sm" ? "64px" : size === "md" ? "100px" : "125px",
      height: size === "sm" ? "64px" : size === "md" ? "100px" : "125px"
    }}>
      <div className="loader">
        <span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </span>
        <div className="base">
          <span></span>
          <div className="face"></div>
        </div>
      </div>
      <div className="longfazers">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
};

export { RocketLogo };