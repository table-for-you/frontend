import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";


export default function Modal({ modalOpen, setModalOpen, children }) {
    const modalBackGround = useRef();

    return (
        <AnimatePresence>
            {modalOpen && (
                <motion.div ref={modalBackGround} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={e => {
                    if (e.target === modalBackGround.current) {
                        setModalOpen(false)
                    }
                }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <motion.div className="bg-white p-5 rounded-lg shadow-lg w-1/4 h-1/3 flex flex-col relative"
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
                        <span class="material-symbols-outlined cursor-pointer absolute top-2 right-2" onClick={() => setModalOpen(false)}>
                            close
                        </span>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    )
}