import { motion } from "framer-motion";

interface PokoAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  expression?: "happy" | "thinking" | "excited" | "wink";
}

const sizeMap = {
  sm: "w-8 h-8 text-lg",
  md: "w-12 h-12 text-2xl",
  lg: "w-16 h-16 text-3xl",
  xl: "w-24 h-24 text-5xl",
};

const expressionMap = {
  happy: "😊",
  thinking: "🤔",
  excited: "🎉",
  wink: "😉",
};

const PokoAvatar = ({ size = "md", animate = true, expression = "happy" }: PokoAvatarProps) => {
  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate
    ? {
        initial: { scale: 0, rotate: -180 },
        animate: { scale: 1, rotate: 0 },
        transition: { type: "spring", stiffness: 200, damping: 15 },
      }
    : {};

  return (
    <Wrapper
      className={`${sizeMap[size]} bg-poko rounded-full flex items-center justify-center shadow-lg`}
      {...animateProps}
    >
      <span role="img" aria-label={`Poko is ${expression}`}>
        {expressionMap[expression]}
      </span>
    </Wrapper>
  );
};

export default PokoAvatar;
