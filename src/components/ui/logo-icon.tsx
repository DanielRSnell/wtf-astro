interface LogoIconProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LogoIcon = ({ className = "", size = "md" }: LogoIconProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16 md:w-24 md:h-24",
    lg: "w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
  };

  return (
    <>
      <style>{`
        @keyframes speeder {
          0% { transform: translate(2px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -3px) rotate(-1deg); }
          20% { transform: translate(-2px, 0px) rotate(1deg); }
          30% { transform: translate(1px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 3px) rotate(-1deg); }
          60% { transform: translate(-1px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-2px, -1px) rotate(1deg); }
          90% { transform: translate(2px, 1px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }

        @keyframes fazer1 {
          0% { left: 0; }
          100% { left: -80px; opacity: 0; }
        }

        @keyframes fazer2 {
          0% { left: 0; }
          100% { left: -100px; opacity: 0; }
        }

        @keyframes fazer3 {
          0% { left: 0; }
          100% { left: -50px; opacity: 0; }
        }

        @keyframes fazer4 {
          0% { left: 0; }
          100% { left: -150px; opacity: 0; }
        }

        @keyframes lf {
          0% { left: 200%; }
          100% { left: -200%; opacity: 0; }
        }

        @keyframes lf2 {
          0% { left: 200%; }
          100% { left: -200%; opacity: 0; }
        }

        @keyframes lf3 {
          0% { left: 200%; }
          100% { left: -100%; opacity: 0; }
        }

        @keyframes lf4 {
          0% { left: 200%; }
          100% { left: -100%; opacity: 0; }
        }

        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px hsl(var(--primary) / 0.3), 
                        0 0 40px hsl(var(--primary) / 0.2), 
                        0 0 60px hsl(var(--primary) / 0.1);
          }
          50% { 
            box-shadow: 0 0 30px hsl(var(--primary) / 0.5), 
                        0 0 60px hsl(var(--primary) / 0.3), 
                        0 0 90px hsl(var(--primary) / 0.2);
          }
        }

        @keyframes border-glow {
          0%, 100% { 
            border-color: hsl(var(--primary) / 0.4);
          }
          50% { 
            border-color: hsl(var(--primary) / 0.8);
          }
        }
      `}</style>
      
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Glowing circle background */}
        <div 
          className="relative w-full h-full rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2"
          style={{
            animation: 'glow-pulse 3s ease-in-out infinite, border-glow 2s ease-in-out infinite',
            backdropFilter: 'blur(1px)'
          }}
        >
          {/* Inner circle with subtle gradient */}
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-background/80 via-background/60 to-background/40 backdrop-blur-sm" />
          
          {/* Main loader container - absolutely positioned and centered */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              animation: 'speeder 0.4s linear infinite',
              transform: 'translate(-50%, -50%) scale(0.6)'
            }}
          >
            {/* Engine trails */}
            <span className="absolute -top-5 left-16 h-1 w-9 bg-primary rounded-sm">
              <span 
                className="absolute top-0 w-8 h-px bg-primary"
                style={{ animation: 'fazer1 0.2s linear infinite' }}
              />
              <span 
                className="absolute top-1 w-8 h-px bg-primary"
                style={{ animation: 'fazer2 0.4s linear infinite' }}
              />
              <span 
                className="absolute top-0.5 w-8 h-px bg-primary"
                style={{ 
                  animation: 'fazer3 0.4s linear infinite',
                  animationDelay: '-1s'
                }}
              />
              <span 
                className="absolute top-1 w-8 h-px bg-primary"
                style={{ 
                  animation: 'fazer4 1s linear infinite',
                  animationDelay: '-1s'
                }}
              />
            </span>

            {/* Main body */}
            <div className="relative">
              {/* Wing */}
              <span 
                className="absolute w-0 h-0 border-t-2 border-b-2 border-r-24 border-t-transparent border-b-transparent border-r-primary"
                style={{
                  borderRightWidth: '100px'
                }}
              />
              
              {/* Front circle */}
              <span 
                className="absolute w-6 h-6 bg-primary rounded-full -right-28 -top-4"
              />
              
              {/* Nose cone */}
              <span 
                className="absolute w-0 h-0 -right-24 -top-4"
                style={{
                  borderTop: '0px solid transparent',
                  borderRight: '55px solid hsl(var(--primary))',
                  borderBottom: '16px solid transparent'
                }}
              />
              
              {/* Cockpit */}
              <div 
                className="absolute w-5 h-3 bg-primary rounded-t-full -right-32 -top-4"
                style={{ 
                  transform: 'rotate(-40deg)',
                  transformOrigin: 'center'
                }}
              >
                <div 
                  className="absolute w-3 h-3 bg-primary right-1 top-2"
                  style={{ 
                    transform: 'rotate(40deg)',
                    transformOrigin: '50% 50%',
                    borderRadius: '0 0 0 2px'
                  }}
                />
              </div>
            </div>

            {/* Long fazers (background trails) - positioned relative to rocket */}
            <div className="absolute inset-0 pointer-events-none" style={{ width: '200px', height: '200px', left: '-100px', top: '-100px' }}>
              <span 
                className="absolute h-0.5 w-1/5 bg-primary/30 top-1/5"
                style={{
                  animation: 'lf 0.6s linear infinite',
                  animationDelay: '-5s'
                }}
              />
              <span 
                className="absolute h-0.5 w-1/5 bg-primary/30 top-2/5"
                style={{
                  animation: 'lf2 0.8s linear infinite',
                  animationDelay: '-1s'
                }}
              />
              <span 
                className="absolute h-0.5 w-1/5 bg-primary/30 top-3/5"
                style={{ animation: 'lf3 0.6s linear infinite' }}
              />
              <span 
                className="absolute h-0.5 w-1/5 bg-primary/30 top-4/5"
                style={{
                  animation: 'lf4 0.5s linear infinite',
                  animationDelay: '-3s'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { LogoIcon };