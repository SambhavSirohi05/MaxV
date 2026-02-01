import { useRef } from 'react';
import FloatingLines from './components/FloatingLines';
import './App.css';

function App() {
  const revealRef = useRef(null);
  const isHoveringRef = useRef(false);

  const handleMouseMove = (e) => {
    isHoveringRef.current = true;
    if (revealRef.current) {
      revealRef.current.style.clipPath = `circle(150px at ${e.clientX}px ${e.clientY}px)`;
    }
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (revealRef.current) {
      revealRef.current.style.clipPath = 'circle(0px at 50% 50%)';
    }
  };

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* FloatingLines Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
        <FloatingLines
          linesGradient={["#1e3a8a", "#e10600", "#f5c400"]}
          animationSpeed={1}
          interactive={false}
          bendRadius={1}
          bendStrength={-2}
          mouseDamping={0}
          parallax={false}
          parallaxStrength={0.1}
        />
      </div>

      {/* Hero Section */}
      <div className="hero">
        {/* Base Image */}
        <div className="image-layer image-base">
          <img src="/max.png" alt="Max Verstappen" loading="eager" />
        </div>

        {/* Reveal Image (shown on hover) */}
        <div
          ref={revealRef}
          className="image-layer image-reveal"
          style={{
            clipPath: 'circle(0px at 50% 50%)',
          }}
        >
          <img src="/helm.png" alt="Max Verstappen with Helmet" loading="eager" />
        </div>

        {/* UI Elements */}
        <div className="ui-container">
          {/* Name */}
          <div className="name-block">
            <div className="name-line">MAX</div>
            <div className="name-line">VERSTAPPEN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
