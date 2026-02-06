'use client';

import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export const BottomSheet = ({ isOpen, onClose, children, title }: BottomSheetProps) => {
    // 背景スクロール固定
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleDragEnd = (_: any, info: PanInfo) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        className="fixed bottom-0 left-0 right-0 z-50 flex max-h-[90vh] flex-col rounded-t-[20px] bg-white text-gray-900 shadow-xl dark:bg-gray-900 dark:text-white"
                        style={{ y: 0 }} // 初期値リセット用
                    >
                        {/* Drag Handle */}
                        <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                            <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>

                        {/* Header (Optional) */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-semibold">{title}</h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <IoClose size={24} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content area with scroll */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 pb-8">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
