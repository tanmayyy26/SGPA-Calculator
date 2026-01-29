import CSS from "./Print.module.css";
import BlurText from "../reactBits/BlurText";
import ClickSpark from "../reactBits/ClickSpark";
let Print = ({ SGPA, setSGPA }) => {
  const Clear = () => {
    setSGPA(0);
  };
  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  return (
    <div className={CSS.outbox}>
        <BlurText
        text={`You May Get ${SGPA} SGPA ✨`}
        delay={150}
        animateBy="words"
        direction="top"
        onAnimationComplete={handleAnimationComplete}
        className="text-2xl font-delius tracking-wider mb-8"
        />

    <ClickSpark
       sparkSize={14}
       sparkRadius={50}
       sparkCount={12}
       duration={400}
      >
      <button className={CSS.btn} onClick={Clear}>
        Recalculate
      </button>
      </ClickSpark>
    </div>
  );
};
export default Print;
