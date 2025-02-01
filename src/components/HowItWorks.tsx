import { steps } from "@/utils/howItWorksContent";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

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
      },
    },
  };

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-white via-blue-50 to-white 
      min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle Background Animation */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 
        opacity-30 animate-gradient-x pointer-events-none"
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent 
            bg-gradient-to-br from-blue-600 to-blue-800"
          >
            Journey of Returns
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            A holistic approach to simplifying your package returns
          </p>
        </motion.div>

        {/* Dharma-Inspired Circular Layout */}
        <motion.div
          variants={circleVariants}
          initial="hidden"
          animate="visible"
          className="relative mx-auto w-full max-w-[600px] aspect-square"
        >
          {/* Rotating Dharma Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 border-2 border-blue-200/50 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-8 border-2 border-blue-200/30 rounded-full"
          />

          {/* Central Hub */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-blue-600 to-blue-800
              rounded-full shadow-2xl relative flex items-center justify-center"
            >
              {/* Step Icons */}
              {steps.map((step, index) => {
                const totalSteps = steps.length;
                const angle = (360 / totalSteps) * index;
                const radius = 200;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    style={{
                      position: "absolute",
                      top: `calc(50% + ${
                        Math.sin((angle * Math.PI) / 180) * radius
                      }px)`,
                      left: `calc(50% + ${
                        Math.cos((angle * Math.PI) / 180) * radius
                      }px)`,
                      transform: `translate(-50%, -50%)`,
                    }}
                    className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white 
                    rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                      activeStep === index ? "ring-4 ring-blue-300" : ""
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 
                      bg-gradient-to-br from-blue-600 to-blue-800 
                      rounded-full flex items-center justify-center"
                    >
                      <step.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </motion.div>
                );
              })}

              {/* Central Content */}
              <div className="absolute inset-0 flex items-center justify-center bg-transparent rounded-full overflow-hidden">
                <AnimatePresence mode="wait">
                  {steps[activeStep]?.illustration ? (
                    <motion.img
                      key={steps[activeStep]?.illustration}
                      src={steps[activeStep]?.illustration}
                      alt={steps[activeStep]?.title}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                      className="text-white text-lg md:text-xl font-bold text-center"
                    >
                      {steps[activeStep]?.title || "No Illustration"}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Active Step Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            variants={stepDetailVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-16 text-center"
          >
            <div className="flex justify-center items-center w-10 h-10 mx-auto bg-blue-100 rounded-full text-blue-800 font-bold">
              {activeStep + 1}
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mt-2">
              {steps[activeStep]?.title}
            </h3>
            <p className="text-gray-600 text-lg mt-2 max-w-xl mx-auto">
              {steps[activeStep]?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
