import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Copy, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ScreenshotModal = ({ isOpen, onClose, imageData }) => {
    const { t } = useTranslation();
    const [isCopied, setIsCopied] = useState(false);

    if (!isOpen || !imageData) return null;

    // ダウンロード処理
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageData;
        link.download = `stellasora-build-${new Date().getTime()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // クリップボードコピー処理
    const handleCopy = async () => {
        try {
            // DataURLをBlobに変換
            const res = await fetch(imageData);
            const blob = await res.blob();
            
            // Clipboard APIを使って画像を書き込む
            await navigator.clipboard.write([
                new ClipboardItem({
                    [blob.type]: blob
                })
            ]);

            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy image: ', err);
            alert('画像のコピーに失敗しました。ブラウザが対応していない可能性があります。');
        }
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-in fade-in duration-200">
            {/* モーダルの高さを確保するために h-[80vh] を追加 */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] h-[80vh]">
                
                {/* ヘッダー */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-950/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white">{t('modal.screenshotPreview')}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                        <X size={24} />
                    </button>
                </div>

                {/* プレビューエリア: スクロールなし、全体表示(contain) */}
                <div className="flex-1 overflow-hidden p-4 bg-slate-950/80 flex items-center justify-center relative">
                    <img 
                        src={imageData} 
                        alt="Screenshot Preview" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-slate-800" 
                    />
                </div>

                {/* フッター（アクションボタン） */}
                <div className="p-4 border-t border-slate-700 bg-slate-900 flex justify-end gap-3 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {t('confirm.close')}
                    </button>
                    
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors border ${isCopied ? 'bg-green-600 text-white border-green-500' : 'bg-slate-700 text-white border-slate-600 hover:bg-slate-600'}`}
                    >
                        {isCopied ? <Check size={16} /> : <Copy size={16} />}
                        {isCopied ? t('imageCopied') : t('copyImage')}
                    </button>

                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-indigo-600 text-white border border-indigo-500 hover:bg-indigo-500 transition-colors"
                    >
                        <Download size={16} />
                        {t('download')}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ScreenshotModal;