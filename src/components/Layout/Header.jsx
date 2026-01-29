import GradientText from "../reactBits/GradientText";
import SplitText from "../reactBits/SplitText";
import { useSGPA } from "../../context/SGPAContext";

let Header = ({loading,handleLoading}) => {
  const { currentSemester } = useSGPA();
  const headerText = `${currentSemester} SGPA Calculator`;
  
  return (
    <div className="relative z-10 text-white text-center p-3 lg:p-5  mt-5 mb-3">
            {loading &&  <SplitText
            text={headerText}
            className=" text-2xl lg:text-3xl font-semibold text-center font-funnel font-thin tracking-wider"
            delay={200}
            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            onLetterAnimationComplete={handleLoading}
        />}
        {!loading &&  <div>
          <GradientText
          colors={[ "#fdfc47","#24fe41", "#ec38bc", "#fdeff9", "#40ffaa"]}
          animationSpeed={5}
          showBorder={false}
          className="custom-class text-2xl lg:text-3xl  font-semibold text-center font-funnel font-thin tracking-wider cursor-pointer"
          >
              {headerText}
          </GradientText>
          <div className="text-xs text-gray-300 mt-1 opacity-80">
            Created by <span className="font-semibold text-yellow-300">Tanmay Wagh</span>
          </div>
        </div>}

</div>
  );
};
export default Header;
