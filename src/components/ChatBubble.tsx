import { motion } from "framer-motion";
import PokoAvatar from "./PokoAvatar";

interface ChatBubbleProps {
  message: string;
  sender: "poko" | "user";
  delay?: number;
}

const ChatBubble = ({ message, sender, delay = 0 }: ChatBubbleProps) => {
  const isPoko = sender === "poko";

  return (
    <motion.div
      className={`flex gap-3 ${isPoko ? "flex-row" : "flex-row-reverse"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {isPoko && <PokoAvatar size="sm" />}
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isPoko
            ? "bg-poko-bubble text-foreground rounded-tl-sm"
            : "bg-primary text-primary-foreground rounded-tr-sm"
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
};

export default ChatBubble;
