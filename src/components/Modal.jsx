import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

export default function Modal({
  modalOpen,
  setModalOpen,
  children,
  parentClass,
  childClass,
  contentMotion,
}) {
  const modalBackGround = useRef();

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          ref={modalBackGround}
          className={parentClass}
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
            className={childClass}
            initial={contentMotion.initial}
            animate={contentMotion.animate}
            exit={contentMotion.exit}
            transition={contentMotion.transition}
          >
            <span
              className="material-symbols-outlined absolute right-2 top-2 cursor-pointer text-[1.4rem]"
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
