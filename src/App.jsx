import { useRef, useCallback } from 'react';
import FloatingLines from './components/FloatingLines';
import './App.css';

function App() {
  const mainBlobRef = useRef(null);
  const trailBlobsRef = useRef([]);
  const splashParticlesRef = useRef([]);
  const trailPositions = useRef([]);
  const lastUpdateRef = useRef(0);
  const throttleDelay = 16; // ~60fps

  const updateSVGElements = useCallback((x, y) => {
    // Update main blob
    if (mainBlobRef.current) {
      mainBlobRef.current.setAttribute('cx', x);
      mainBlobRef.current.setAttribute('cy', y);
    }

    // Update trail positions
    trailPositions.current = [{ x, y }, ...trailPositions.current.slice(0, 3)];

    // Update trail blobs
    for (let i = 0; i < 4; i++) { // Max 4 trail points
      const blob = trailBlobsRef.current[i];
      if (blob) {
        if (trailPositions.current[i]) {
          blob.setAttribute('cx', trailPositions.current[i].x);
          blob.setAttribute('cy', trailPositions.current[i].y);
          blob.setAttribute('opacity', 0.85); // Make visible
        } else {
          blob.setAttribute('opacity', 0); // Hide if no position
        }
      }
    }

    // Update splash particles
    for (let i = 0; i < 4; i++) { // Max 4 trail points
      const particleGroup = splashParticlesRef.current[i];
      if (particleGroup) {
        if (trailPositions.current[i]) {
          const point = trailPositions.current[i];
          const particles = particleGroup.children;

          if (particles[0]) {
            particles[0].setAttribute('cx', point.x + (Math.sin(i * 2) * (30 + i * 10)));
            particles[0].setAttribute('cy', point.y + (Math.cos(i * 2) * (30 + i * 10)));
          }
          if (particles[1]) {
            particles[1].setAttribute('cx', point.x - (Math.sin(i * 3) * (25 + i * 8)));
            particles[1].setAttribute('cy', point.y + (Math.cos(i * 3) * (25 + i * 8)));
          }
          if (particles[2]) {
            particles[2].setAttribute('cx', point.x + (Math.cos(i * 4) * (35 + i * 12)));
            particles[2].setAttribute('cy', point.y - (Math.sin(i * 4) * (35 + i * 12)));
          }
          particleGroup.setAttribute('opacity', 1); // Make visible
        } else {
          particleGroup.setAttribute('opacity', 0); // Hide if no position
        }
      }
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < throttleDelay) return;
    lastUpdateRef.current = now;

    updateSVGElements(e.clientX, e.clientY);
  }, [updateSVGElements]);

  const handleMouseLeave = useCallback(() => {
    trailPositions.current = [];
    // Hide all trail and particle elements
    for (let i = 0; i < 4; i++) {
      if (trailBlobsRef.current[i]) {
        trailBlobsRef.current[i].setAttribute('opacity', 0);
      }
      if (splashParticlesRef.current[i]) {
        splashParticlesRef.current[i].setAttribute('opacity', 0);
      }
    }
  }, []);

  return (
    <div className="app" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* SVG Filter for Splash Effect */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

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

        {/* Reveal Image with Splash Mask */}
        <div className="image-layer image-reveal liquid-mask">
          <svg
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <defs>
              <mask id="liquidMask">
                <rect width="100%" height="100%" fill="black" />
                <g filter="url(#gooey)">
                  {/* Main splash blob */}
                  <ellipse
                    ref={mainBlobRef}
                    cx="0"
                    cy="0"
                    rx="110"
                    ry="95"
                    fill="white"
                  />
                  {/* Trail blobs */}
                  {[0, 1, 2, 3].map((i) => (
                    <ellipse
                      key={`trail - ${i} `}
                      ref={el => trailBlobsRef.current[i] = el}
                      cx="0"
                      cy="0"
                      rx={95 - (i * 18)}
                      ry={80 - (i * 15)}
                      fill="white"
                      opacity="0.85"
                    />
                  ))}
                  {/* Splash particles */}
                  {[0, 1, 2, 3].map((i) => (
                    <g key={`splash - ${i} `} ref={el => splashParticlesRef.current[i] = el}>
                      <circle
                        cx="0"
                        cy="0"
                        r={15 - i * 3}
                        fill="white"
                        opacity="0.7"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={12 - i * 2}
                        fill="white"
                        opacity="0.6"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r={10 - i * 2}
                        fill="white"
                        opacity="0.5"
                      />
                    </g>
                  ))}
                </g>
              </mask>
            </defs>
          </svg>
          <img
            src="/helm.png"
            alt="Max Verstappen with Helmet"
            loading="eager"
            style={{ mask: 'url(#liquidMask)', WebkitMask: 'url(#liquidMask)' }}
          />
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
