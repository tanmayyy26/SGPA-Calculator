import { useState, useRef, useEffect } from "react";
import CSS from "./Circle.module.css";
import Print from "../Features/Print";

const Circle = ({ SGPA,setSGPA }) => {
  const [printSGPA, setPrintSGPA] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    let start = 0;
    const duration = 2500; // 1 second animation
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentSGPA = progress * SGPA;
      setPrintSGPA(currentSGPA);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    cancelAnimationFrame(animationRef.current); // Cancel any previous animation
    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [SGPA]);

  // Dynamic gradient color based on SGPA
  const getColor = (value) => {
    if (value < 4) return "red";
    if (value < 7) return "yellow";
    return "lime";
  };

  const progressCircle = {
    transition: `all 0.3s ease-in-out`,
    backgroundImage: `conic-gradient(
      ${getColor(printSGPA)} ${printSGPA * 36}deg,
      #2e2e2e ${printSGPA * 36}deg
    )`,
  };

  return (
    <>
    <div className={`${CSS.container} flex flex-col gap-4 items-center`}>
      <div className={`${CSS.progress}`} style={progressCircle}>
        <span className={CSS.value}>{printSGPA.toFixed(2)}</span>
      </div>
        <Print SGPA={SGPA} setSGPA={setSGPA}/>
    </div>
    </>
  );
};

export default Circle;
