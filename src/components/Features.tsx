import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import {
  container,
  features,
  featuresContent,
  imageCar,
  item,
} from "@/utils/featuresContent";

export default function Features() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none -z-10">
        <svg
          className="w-full h-32 text-blue-50"
          fill="currentColor"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path d="M0,64L40,74.7C80,85,160,107,240,117.3C320,128,400,128,480,117.3C560,107,640,85,720,85.3C800,85,880,107,960,128C1040,149,1120,171,1200,176C1280,181,1360,171,1400,165.3L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl font-extrabold bg-clip-text text-transparent 
            bg-gradient-to-br from-blue-600 to-blue-800 mb-4"
          >
            {featuresContent.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {featuresContent.text}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="perspective-1000"
            >
              <Card
                className="relative overflow-hidden group hover:shadow-2xl 
                  transition-all duration-300 transform hover:-translate-y-2 
                  hover:rotate-1 border-2 border-transparent hover:border-blue-200"
              >
                <div
                  className="absolute inset-0 bg-blue-50/50 opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300 
                    pointer-events-none"
                />
                <CardContent className="p-6 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="mb-4 inline-flex h-16 w-16 items-center justify-center 
                      rounded-xl bg-blue-100 group-hover:bg-blue-600 
                      transition-all duration-300 shadow-md"
                  >
                    <feature.icon
                      className="h-8 w-8 text-blue-600 group-hover:text-white 
                        group-hover:scale-110 transition-all duration-300"
                    />
                  </motion.div>

                  <h3
                    className="text-2xl font-bold mb-3 text-blue-900 
                      group-hover:text-blue-700 transition-colors"
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="text-gray-600 group-hover:text-gray-800 
                      transition-colors mb-4"
                  >
                    {feature.description}
                  </p>

                  {/* Sub-bullet points */}
                  {feature.points && feature.points.length > 0 && (
                    <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1">
                      {feature.points.map((point: string, i: number) => (
                        <li key={i} className="group-hover:text-gray-800">
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Subtle animated underline on hover */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="h-0.5 bg-blue-500 mt-4 origin-left"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold text-blue-800 mb-4">
            Ready to Experience Effortless Returns?
          </h3>
          <p className="text-gray-700 mb-6 max-w-lg mx-auto">
            Sign up today and enjoy a seamless returns process, fast refunds,
            and complete peace of mind.
          </p>
          <a
            href="/schedule-return"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold 
            rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
        </motion.div>

        {/* Floating Delivery Car Image */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block absolute -bottom-20 right-24 z-10 pointer-events-none "
        >
          <img
            src={imageCar.illustration}
            alt="Delivery Car Illustration"
            className="w-48 xl:w-64"
          />
        </motion.div>
      </div>

      {/* Bottom Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none -z-10">
        <svg
          className="w-full h-32 text-blue-50 rotate-180"
          fill="currentColor"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path d="M0,64L40,74.7C80,85,160,107,240,117.3C320,128,400,128,480,117.3C560,107,640,85,720,85.3C800,85,880,107,960,128C1040,149,1120,171,1200,176C1280,181,1360,171,1400,165.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z" />
        </svg>
      </div>
    </section>
  );
}
