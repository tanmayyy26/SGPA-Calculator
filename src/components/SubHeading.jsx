import SplitText from './reactBits/SplitText'

const subHeading = () => {
  return (
    <div className="relative z-10 text-white text-center ">
    <SplitText
        text="Let's Calculate the Expected SGPA For Semester 2"
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
