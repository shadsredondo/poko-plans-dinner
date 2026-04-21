import { motion } from "framer-motion";
import pokoImg from "@/assets/poko-avatar.png";

interface PokoAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
}

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

const PokoAvatar = ({ size = "md", animate = true }: PokoAvatarProps) => {
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
      className={`${sizeMap[size]} rounded-full overflow-hidden flex items-center justify-center bg-muted ring-1 ring-border`}
      {...animateProps}
    >
      <img src={pokoImg} alt="Poko" className="w-full h-full object-cover" />
    </Wrapper>
  );
};

export default PokoAvatar;
