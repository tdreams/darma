// featuresContent.ts

import { RefreshCcw, MapPin, Headphones } from "lucide-react";

/**
 * Main heading and subtext for the Features section
 */
export const featuresContent = {
  title: "Everything you need for a hassle-free return",
  text: "We've streamlined the process to make returns as simple as possible. Here’s how we stand out:",
};

/**
 * Individual feature cards
 */
export const features = [
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "Initiate and schedule returns with just a few clicks.",
    points: [
      "No need to print labels",
      "On-demand or scheduled pickup",
      "Real-time driver updates",
    ],
  },
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description:
      "Stay informed of your return’s journey every step of the way.",
    points: [
      "Live location updates",
      "Accurate ETAs",
      "Automatic status notifications",
    ],
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Get assistance whenever you need it.",
    points: [
      "Live chat and phone hotline",
      "Email support for quick resolutions",
      "Dedicated help center resources",
    ],
  },
];

/**
 * Framer Motion variants for the parent container and each item
 */
export const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const imageCar = {
  illustration: "/images/features.png",
};
