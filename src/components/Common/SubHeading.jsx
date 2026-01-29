import SplitText from '../reactBits/SplitText'
import { useSGPA } from '../../context/SGPAContext'

const subHeading = () => {
  const { currentSemester } = useSGPA();
  const subheadingText = `Let's Calculate the Expected SGPA For ${currentSemester}`;
  
  return (
    <div className="relative z-10 text-white text-center ">
    <SplitText
        text={subheadingText}
        className="text-sm lg:text-xl text-center font-funnel font-thin tracking-wider border-b-1 pb-3"
        delay={100}
        animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
        animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
    />
</div>
  )
}

export default subHeading;
