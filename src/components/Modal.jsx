import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function Modal({ modalOpen, setModalOpen, children }) {
  const modalBackGround = useRef();

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          ref={modalBackGround}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            if (e.target === modalBackGround.current) {
              setModalOpen(false);
            }
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative flex flex-col rounded-lg bg-white p-5 shadow-lg sm:h-1/4"
            initial={{ opacity: 0, y: -200 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -200 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.5,
            }}
          >
            <span
              className="material-symbols-outlined absolute right-2 top-2 cursor-pointer hidden sm:block"
              onClick={() => setModalOpen(false)}
            >
              close
            </span>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
