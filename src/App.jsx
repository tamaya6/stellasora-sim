import React, { useState, useEffect, useRef } from 'react';
import { Star, RotateCcw, Share2, Save, Globe, Check, ChevronDown, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import { CHARACTERS } from './data';
import { generateShareHash, loadFromUrl, reorder } from './utils/storage';

// カスタムフック
import { useParty } from './hooks/useParty';
import { useSaves } from './hooks/useSaves';
import { useScreenshot } from './hooks/useScreenshot';

// コンポーネント
import ConfirmModal from './components/ui/ConfirmModal';
import Toast from './components/ui/Toast';
import SaveSlot from './components/feature/SaveSlot';
import PartySlot from './components/feature/PartySlot';
import ScreenshotModal from './components/feature/ScreenshotModal';

export default function App() {
    const { t, i18n } = useTranslation();
    
    // カスタムフックの使用
    const party = useParty();
    const storage = useSaves();
    const screenshot = useScreenshot();

    // UI状態
    const [isCopied, setIsCopied] = useState(false);
    const [toast, setToast] = useState({ message: null, type: 'info' });
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef(null);
    
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {},
        isDestructive: false
    });

    // 言語メニューの外側クリック検知
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // --- ヘルパー関数 ---

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const closeToast = () => setToast({ ...toast, message: null });

    const showConfirm = (message, onConfirm, isDestructive = false) => {
        setConfirmState({ isOpen: true, message, onConfirm, isDestructive });
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
    };

    // --- イベントハンドラ ---

    const onResetAll = () => {
        showConfirm(
            t('confirm.resetAll'),
            () => party.resetAll(),
            true
        );
    };

    const onSaveData = (index) => {
        storage.saveGame(index, party.party);
    };

    const onLoadData = (index) => {
        const data = storage.loadGame(index); 
        if (!data) return;

        showConfirm(
            t('confirm.loadData', { index: index + 1 }),
            // データの正規化は useParty.setParty 内で行われる
            () => party.setParty(data)
        );
    };

    const onDeleteData = (index) => {
        showConfirm(
            t('confirm.deleteData', { index: index + 1 }),
            () => storage.deleteGame(index),
            true
        );
    };

    const onTakeScreenshot = async () => {
        const success = await screenshot.takeScreenshot();
        if (!success) {
            showToast(t('toast.screenshotFailed'), 'error');
        }
    };

    const onCopyUrl = () => {
        const hash = generateShareHash(party.party);
        const shareUrl = hash ? `${window.location.origin}${window.location.pathname}${hash}` : window.location.href;
        
        const fallbackCopyTextToClipboard = (text) => {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.opacity = "0";
            textArea.style.pointerEvents = "none";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                    showToast(t('toast.copySuccess'), 'success');
                } else {
                    showToast(t('toast.copyFailed'), 'error');
                }
            } catch (err) {
                showToast(t('toast.copyFailed'), 'error');
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                    showToast(t('toast.copySuccess'), 'success');
                })
                .catch(err => {
                    fallbackCopyTextToClipboard(shareUrl);
                });
        } else {
            fallbackCopyTextToClipboard(shareUrl);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white pb-8 flex flex-col">
            <nav className="bg-slate-900/90 backdrop-blur border-b border-slate-800 z-20 shadow-xl sticky top-0">
                <div className="max-w-7xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
                            <Star className="text-yellow-500 w-5 h-5" fill="currentColor" />
                        </div>
                        <h1 className="font-bold text-lg sm:text-xl tracking-wider hidden sm:block">
                            {t('appTitle')} <span className="text-xs font-normal text-slate-400 ml-1">{t('appSubtitle')}</span>
                        </h1>
                        <h1 className="font-bold text-lg tracking-wider sm:hidden">
                            {t('appTitle')}
                        </h1>
                    </div>
                    <div className="flex gap-2 items-center">
                        
                        {/* 言語切り替え */}
                        <div className="relative" ref={langMenuRef}>
                            <button 
                                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm rounded transition-all border ${isLangMenuOpen ? 'bg-slate-800 text-white border-slate-600' : 'text-slate-400 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                            >
                                <Globe size={14} />
                                <span className="hidden sm:inline">{i18n.language === 'ja' ? '日本語' : 'English'}</span>
                                <span className="sm:hidden">{i18n.language === 'ja' ? 'JP' : 'EN'}</span>
                                <ChevronDown size={12} className={`transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isLangMenuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <button 
                                        onClick={() => changeLanguage('ja')}
                                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-800 transition-colors ${i18n.language === 'ja' ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}
                                    >
                                        <span>日本語</span>
                                        {i18n.language === 'ja' && <Check size={12} />}
                                    </button>
                                    <button 
                                        onClick={() => changeLanguage('en')}
                                        className={`w-full text-left px-4 py-2 text-xs sm:text-sm flex items-center justify-between hover:bg-slate-800 transition-colors ${i18n.language === 'en' ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}
                                    >
                                        <span>English</span>
                                        {i18n.language === 'en' && <Check size={12} />}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="w-px h-6 bg-slate-800 mx-1 hidden sm:block"></div>
                        
                        {/* スクリーンショットボタン */}
                        <button 
                            onClick={onTakeScreenshot}
                            disabled={screenshot.isTaking}
                            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-slate-700"
                            title={t('screenshot')}
                        >
                            <Camera size={14} className="sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">{t('screenshot')}</span>
                        </button>

                        <button 
                            onClick={onResetAll}
                            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-slate-700"
                        >
                            <RotateCcw size={14} className="sm:w-4 sm:h-4" /> 
                            <span className="hidden sm:inline">{t('reset')}</span>
                        </button>
                        <button 
                            onClick={onCopyUrl}
                            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded shadow-lg transition-all border ${isCopied ? 'bg-green-600 border-green-500 text-white' : 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 text-white'}`}
                        >
                            {isCopied ? (
                                <span className="flex gap-1 items-center">{t('copied')}</span>
                            ) : (
                                <><Share2 size={14} className="sm:w-4 sm:h-4" /> {t('share')}</>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* セーブデータエリア */}
            <div className="w-full max-w-7xl mx-auto px-4 pt-6 pb-2">
                <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-xl p-4 shadow-lg">
                    <h2 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                        <Save size={16} className="text-indigo-400" /> {t('saveData')}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {storage.saves.map((save, idx) => (
                            <SaveSlot 
                                key={idx} 
                                index={idx}
                                data={save} 
                                onSave={() => onSaveData(idx)}
                                onLoad={() => onLoadData(idx)}
                                onDelete={() => onDeleteData(idx)}
                                onConfirmDelete={() => onDeleteData(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* スクリーンショット撮影対象エリア */}
            <main ref={screenshot.ref} className="flex-1 w-full max-w-7xl mx-auto p-4 space-y-4 overflow-y-auto bg-slate-950">
                {party.party.map((slot, idx) => (
                    <PartySlot 
                        key={idx}
                        slotIndex={idx}
                        charId={slot.charId}
                        potentialsData={slot.potentials} // skills -> potentials
                        potentialOrder={slot.potentialOrder} // skillOrder -> potentialOrder
                        sortMode={slot.sortMode} 
                        hideUnacquired={slot.hideUnacquired} 
                        slotTypeLabel={idx === 0 ? t('slot.main') : t('slot.support')}
                        onSelectChar={(id) => party.updateSlot(idx, id)}
                        onUpdatePotential={(pId, pData) => party.updatePotential(idx, pId, pData)}
                        onClear={() => party.clearSlot(idx)}
                        onReorderPotentials={(src, dst) => party.reorderPotentials(idx, src, dst)}
                        onUpdatePotentialOrder={(newOrder) => party.updatePotentialOrder(idx, newOrder)}
                        onUpdateSettings={(settings) => party.updateSlotSettings(idx, settings)}
                    />
                ))}
            </main>

            <footer className="py-6 text-center text-slate-500 text-xs flex flex-col gap-2">
                <div>{t('footer.copyright')}</div>
                <div>
                    <a 
                        href="https://github.com/tamaya6/stellasora-sim" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-slate-300 transition-colors underline"
                    >
                        GitHub
                    </a>
                </div>
            </footer>
            
            {/* トースト通知 */}
            <Toast 
                message={toast.message} 
                type={toast.type} 
                onClose={closeToast} 
            />

            {/* 確認モーダル */}
            <ConfirmModal 
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                message={confirmState.message}
                isDestructive={confirmState.isDestructive}
            />

            {/* スクリーンショットプレビューモーダル */}
            <ScreenshotModal 
                isOpen={screenshot.isModalOpen}
                onClose={screenshot.closeModal}
                imageData={screenshot.screenshotData}
            />
        </div>
    );
}