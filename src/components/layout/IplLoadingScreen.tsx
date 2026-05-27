import { motion } from 'framer-motion';

export const IplLoadingScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-ipl-bg-dark">
      {/* Animated Stumps & Ball */}
      <div className="relative w-32 h-32 mb-8 flex justify-center items-end">
        {/* Stumps */}
        <div className="flex gap-2 items-end h-16 relative z-10">
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 60 }} transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-2 rounded-t-sm bg-ipl-text-muted"
          ></motion.div>
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 60 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="w-2 rounded-t-sm bg-ipl-text-muted"
          ></motion.div>
          <motion.div 
            initial={{ height: 0 }} animate={{ height: 60 }} transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="w-2 rounded-t-sm bg-ipl-text-muted"
          ></motion.div>
          {/* Bails */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="absolute -top-1 left-0 w-4 h-1 bg-white/50 rounded-full"
          ></motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="absolute -top-1 right-0 w-4 h-1 bg-white/50 rounded-full"
          ></motion.div>
        </div>

        {/* Bouncing Ball */}
        <motion.div 
          className="absolute w-5 h-5 bg-ipl-accent rounded-full shadow-[0_0_10px_rgba(255,107,53,0.8)] z-20"
          initial={{ x: -100, y: -50 }}
          animate={{ x: 10, y: [0, -40, 0] }}
          transition={{ 
            x: { duration: 1.5, ease: "easeOut", repeat: Infinity, repeatType: "mirror" },
            y: { duration: 0.5, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }
          }}
        />
      </div>

      <motion.h2 
        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-ipl-primary to-white mb-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading Match Analytics...
      </motion.h2>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-ipl-primary"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
    </div>
  );
};
