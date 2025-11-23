import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';

export const useScreenshot = () => {
    const ref = useRef(null);
    const [screenshotData, setScreenshotData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTaking, setIsTaking] = useState(false);

    const takeScreenshot = async () => {
        if (!ref.current) return false;

        setIsTaking(true);

        try {
            const element = ref.current;
            const width = element.scrollWidth;
            const height = element.scrollHeight;

            const dataUrl = await toPng(element, {
                backgroundColor: '#0f172a', // bg-slate-950
                width: width,
                height: height,
                style: {
                    overflow: 'visible', 
                    height: 'auto',
                    maxHeight: 'none',
                    padding: '10px',
                    margin: 0
                },
                pixelRatio: 1.5,
                cacheBust: true,
                // screenshot-hide クラスを持つ要素を除外
                filter: (node) => {
                    return !node.classList?.contains('screenshot-hide');
                }
            });
            
            setScreenshotData(dataUrl);
            setIsModalOpen(true);
            return true;
        } catch (err) {
            console.error("Screenshot failed:", err);
            return false;
        } finally {
            setIsTaking(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setScreenshotData(null);
    };

    return {
        ref,
        screenshotData,
        isModalOpen,
        isTaking,
        takeScreenshot,
        closeModal
    };
};