import { RefreshCcw, MapPin, HeadphonesIcon } from "lucide-react";

export const featuresContent = {
  title: "Everything you need for hassle-free return",
  text: "We've streamlined the return process to make it as simple as possible. Here's what makes us different.",
};

export const features = [
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description:
      "Simple process to return your packages with just a few clicks",
  },
  {
    icon: MapPin,
    title: "Real-time Tracking",
    description: "Know where your return is at all times with precise tracking",
  },
  {
    icon: HeadphonesIcon,
    title: "Customer Support",
    description: "24/7 assistance for all your queries and concerns",
  },
];

{
  /* Container and item*/
}

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
