import { steps } from "@/utils/howItWorksContent";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 768 });

  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoRotate]);

  // Animation variants
  const circleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
      },
    },
  };

  const stepDetailVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        delay: 0.2,
      },
    },
  };

  // Geometry setup
  const centerCircleRadius = isMobile ? 70 : 100;
  const outerCircleCenterRadius = isMobile ? 140 : 200;

  return (
    <section
      id="how-it-works"
      className="py-16 md:py-24 bg-white 
      min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Enhanced Particle Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-blue-500 mb-4">
            Smart Return Process
          </h2>
          <p
            className="text-lg md:text-xl text-blue-500 max-w-2xl mx-auto font-medium 
            bg-white/10 backdrop-blur-sm rounded-lg p-3"
          >
            Effortless returns in three simple steps
          </p>
        </motion.div>

        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Mobile Step Indicators */}
          {isMobile && (
            <div className="flex gap-4 mb-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    activeStep === index
                      ? "bg-blue-300 scale-125 ring-2 ring-blue-100"
                      : "bg-blue-400/30 hover:scale-110"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Enhanced Circular Diagram */}
          <motion.div
            variants={circleVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-[300px] md:max-w-[400px] aspect-square"
          >
            {/* Animated Connection Lines */}
            <svg className="absolute inset-0 w-full h-full">
              {steps.map((_, index) => {
                const totalSteps = steps.length;
                const angle = ((360 / totalSteps) * index * Math.PI) / 180;
                const startX =
                  50 +
                  ((Math.cos(angle) * centerCircleRadius) /
                    (outerCircleCenterRadius * 2)) *
                    100;
                const startY =
                  50 +
                  ((Math.sin(angle) * centerCircleRadius) /
                    (outerCircleCenterRadius * 2)) *
                    100;
                const endX =
                  50 +
                  ((Math.cos(angle) * outerCircleCenterRadius) /
                    (outerCircleCenterRadius * 2)) *
                    100;
                const endY =
                  50 +
                  ((Math.sin(angle) * outerCircleCenterRadius) /
                    (outerCircleCenterRadius * 2)) *
                    100;

                return (
                  <line
                    key={index}
                    x1={`${startX}%`}
                    y1={`${startY}%`}
                    x2={`${endX}%`}
                    y2={`${endY}%`}
                    stroke="currentColor"
                    className={`text-blue-400/50 transition-all duration-500 ${
                      activeStep === index
                        ? "opacity-100 stroke-[2.5px]"
                        : "opacity-50 hover:opacity-75"
                    }`}
                  />
                );
              })}
            </svg>

            {/* Enhanced Step Circles */}
            {steps.map((step, index) => {
              const angle = ((360 / steps.length) * index * Math.PI) / 180;
              const offsetX = Math.cos(angle) * outerCircleCenterRadius - 10;
              const offsetY = Math.sin(angle) * outerCircleCenterRadius - 10;

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring" }}
                  style={{
                    position: "absolute",
                    top: `calc(45% + ${offsetY}px)`,
                    left: `calc(45% + ${offsetX}px)`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className={`group flex items-center justify-center w-14 h-14 md:w-20 md:h-20 
                    rounded-full shadow-lg transition-all duration-300 focus:outline-none
                    ${
                      activeStep === index
                        ? "ring-4 ring-blue-300 ring-opacity-80 scale-110 shadow-xl"
                        : "hover:scale-105 hover:ring-2 hover:ring-blue-200 hover:shadow-md"
                    }`}
                  onClick={() => {
                    setActiveStep(index);
                    setAutoRotate(false);
                    setTimeout(() => setAutoRotate(true), 10000);
                  }}
                >
                  <div
                    className="w-full h-full bg-blue-500 
                    rounded-full flex items-center justify-center p-2 shadow-inner
                    group-hover:bg-gradient-to-tl transition-all duration-300"
                  >
                    <step.icon
                      className="w-6 h-6 md:w-8 md:h-8 text-white 
                      transition-transform group-hover:scale-125"
                    />
                  </div>
                </motion.button>
              );
            })}

            {/* Enhanced Center Circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="relative rounded-full shadow-2xl border-4 border-white/20 overflow-hidden 
                  bg-gradient-to-br from-blue-400/30 to-blue-600/30 backdrop-blur-lg"
                style={{
                  width: `${centerCircleRadius * 2}px`,
                  height: `${centerCircleRadius * 2}px`,
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {steps[activeStep]?.illustration ? (
                      <img
                        src={steps[activeStep].illustration}
                        alt={steps[activeStep].title}
                        className="w-full h-full object-cover "
                      />
                    ) : (
                      <div className="space-y-2 text-center p-4">
                        <div
                          className="text-4xl md:text-5xl font-bold text-white
                          drop-shadow-sm animate-text-shine"
                        >
                          {activeStep + 1}
                        </div>
                        <div
                          className="text-sm md:text-base font-medium text-blue-100 
                          bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm"
                        >
                          {steps[activeStep]?.title}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Details Panel */}
          <motion.div
            variants={stepDetailVariants}
            initial="hidden"
            animate="visible"
            className="w-full lg:max-w-md bg-blue-500/95 backdrop-blur-lg rounded-2xl p-6 md:p-8 
            shadow-2xl border border-white/20 mt-8 lg:mt-0 lg:ml-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center 
                text-white font-bold text-lg shadow-inner"
              >
                {activeStep + 1}
              </div>
              <h3 className="text-2xl font-bold text-white drop-shadow-sm">
                {steps[activeStep]?.title}
              </h3>
            </div>
            <p
              className="text-blue-100 leading-relaxed text-lg md:text-base 
              bg-white/15 backdrop-blur-sm rounded-lg p-3"
            >
              {steps[activeStep]?.description}
            </p>

            {!isMobile && (
              <div className="flex gap-2 mt-6">
                {steps.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-8 h-2 rounded-full transition-all duration-300 ${
                      activeStep === index
                        ? "bg-blue-300 scale-125"
                        : "bg-blue-400/30 hover:bg-blue-300/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
