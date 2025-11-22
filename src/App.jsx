import React, { useState, useEffect, useRef } from 'react';
import { Star, RotateCcw, Share2, Save, Globe, Check, ChevronDown } from 'lucide-react'; // アイコン追加
import { useTranslation } from 'react-i18next';
import { CHARACTERS } from './data';
import { generateShareHash, loadFromUrl, reorder } from './utils/storage';

// コンポーネントのインポート
import ConfirmModal from './components/ui/ConfirmModal';
import SaveSlot from './components/feature/SaveSlot';
import PartySlot from './components/feature/PartySlot';

export default function App() {
    const { t, i18n } = useTranslation();
    
    const [party, setParty] = useState([
        { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
        { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
        { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false }
    ]);
    
    const [saves, setSaves] = useState(Array(6).fill(null)); 
    const [isCopied, setIsCopied] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    
    // 言語メニュー用ステート
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
    const langMenuRef = useRef(null);
    
    // Confirm Modal State
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {},
        isDestructive: false
    });

    // 初期化時にURLとLocalStorageから復元
    useEffect(() => {
        const loadedFromUrl = loadFromUrl();
        if (loadedFromUrl && Array.isArray(loadedFromUrl) && loadedFromUrl.length === 3) {
            setParty(loadedFromUrl);
            const cleanUrl = window.location.pathname + window.location.search;
            window.history.replaceState(null, '', cleanUrl);
        }

        const savedData = localStorage.getItem('stellasora_saves');
        if (savedData) {
            try {
                setSaves(JSON.parse(savedData));
            } catch (e) {
                console.error("Failed to parse save data", e);
            }
        }

        setIsLoaded(true);
    }, []);

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

    // モーダル表示ヘルパー
    const showConfirm = (message, onConfirm, isDestructive = false) => {
        setConfirmState({
            isOpen: true,
            message,
            onConfirm,
            isDestructive
        });
    };

    const handleSaveData = (index) => {
        const newSaves = [...saves];
        newSaves[index] = {
            timestamp: new Date().toLocaleString(),
            party: JSON.parse(JSON.stringify(party))
        };
        setSaves(newSaves);
        localStorage.setItem('stellasora_saves', JSON.stringify(newSaves));
    };

    const handleLoadData = (index) => {
        if (!saves[index]) return;
        showConfirm(
            t('confirm.loadData', { index: index + 1 }),
            () => setParty(JSON.parse(JSON.stringify(saves[index].party)))
        );
    };

    const handleDeleteData = (index) => {
        showConfirm(
            t('confirm.deleteData', { index: index + 1 }),
            () => {
                const newSaves = [...saves];
                newSaves[index] = null;
                setSaves(newSaves);
                localStorage.setItem('stellasora_saves', JSON.stringify(newSaves));
            },
            true
        );
    };

    const updateSlot = (slotIndex, charId) => {
        const newParty = [...party];
        const selectedChar = CHARACTERS.find(c => c.id === charId);
        
        const targetCategory = slotIndex === 0 ? 'main' : 'support';
        const subSkillPool = selectedChar ? selectedChar.skillSets[`${targetCategory}Sub`] : [];
        const defaultOrder = subSkillPool.map(s => s.id);
        
        newParty[slotIndex] = { 
            charId, 
            skills: {}, 
            skillOrder: defaultOrder,
            sortMode: 'default',
            hideUnacquired: false 
        };
        setParty(newParty);
    };

    const updateSkill = (slotIndex, skillId, skillData) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                skills: {
                    ...slot.skills,
                    [skillId]: skillData
                }
            };
        });
        setParty(newParty);
    };

    const clearSlot = (slotIndex) => {
        const newParty = [...party];
        newParty[slotIndex] = { 
            charId: null, 
            skills: {}, 
            skillOrder: [],
            sortMode: 'default',
            hideUnacquired: false
        };
        setParty(newParty);
    };

    const reorderSkills = (slotIndex, sourceSkillId, targetSkillId) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;

            const currentOrder = slot.skillOrder;
            const sourceIndex = currentOrder.indexOf(sourceSkillId);
            const targetIndex = currentOrder.indexOf(targetSkillId);

            if (sourceIndex === -1 || targetIndex === -1) return slot;

            const newOrder = reorder(currentOrder, sourceIndex, targetIndex);
            
            return {
                ...slot,
                skillOrder: newOrder
            };
        });
        
        setParty(newParty);
    };

    const updateSkillOrder = (slotIndex, newOrder) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                skillOrder: newOrder
            };
        });
        setParty(newParty);
    };

    const updateSlotSettings = (slotIndex, settings) => {
        const newParty = party.map((slot, i) => {
            if (i !== slotIndex) return slot;
            return {
                ...slot,
                ...settings
            };
        });
        setParty(newParty);
    };

    const resetAll = () => {
        showConfirm(
            t('confirm.resetAll'),
            () => {
                setParty([
                    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
                    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false },
                    { charId: null, skills: {}, skillOrder: [], sortMode: 'default', hideUnacquired: false }
                ]);
                window.history.replaceState(null, '', window.location.pathname);
            },
            true
        );
    }

    const copyUrl = () => {
        const hash = generateShareHash(party);
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
                } else {
                    alert("Failed to copy.");
                }
            } catch (err) {
                alert("Failed to copy.");
            }
            document.body.removeChild(textArea);
        };

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                })
                .catch(err => {
                    fallbackCopyTextToClipboard(shareUrl);
                });
        } else {
            fallbackCopyTextToClipboard(shareUrl);
        }
    };

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setIsLangMenuOpen(false);
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
                        
                        {/* リッチな言語切り替えドロップダウン */}
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

                        <button 
                            onClick={resetAll}
                            className="flex items-center gap-1 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm text-red-400 hover:bg-slate-800 rounded transition-colors border border-transparent hover:border-slate-700"
                        >
                            <RotateCcw size={14} className="sm:w-4 sm:h-4" /> 
                            <span className="hidden sm:inline">{t('reset')}</span>
                        </button>
                        <button 
                            onClick={copyUrl}
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
                        {saves.map((save, idx) => (
                            <SaveSlot 
                                key={idx} 
                                index={idx}
                                data={save} 
                                onSave={() => handleSaveData(idx)}
                                onLoad={() => handleLoadData(idx)}
                                onDelete={() => handleDeleteData(idx)}
                                onConfirmDelete={() => handleDeleteData(idx)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto p-4 space-y-4 overflow-y-auto">
                {party.map((slot, idx) => (
                    <PartySlot 
                        key={idx}
                        slotIndex={idx}
                        charId={slot.charId}
                        skillsData={slot.skills}
                        skillOrder={slot.skillOrder} 
                        sortMode={slot.sortMode} 
                        hideUnacquired={slot.hideUnacquired} 
                        slotTypeLabel={idx === 0 ? t('slot.main') : t('slot.support')}
                        onSelectChar={(id) => updateSlot(idx, id)}
                        onUpdateSkill={(skillId, data) => updateSkill(idx, skillId, data)}
                        onClear={() => clearSlot(idx)}
                        onReorderSkills={(src, dst) => reorderSkills(idx, src, dst)}
                        onUpdateSkillOrder={(newOrder) => updateSkillOrder(idx, newOrder)}
                        onUpdateSettings={(settings) => updateSlotSettings(idx, settings)}
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
            
            {/* 確認モーダル */}
            <ConfirmModal 
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmState.onConfirm}
                message={confirmState.message}
                isDestructive={confirmState.isDestructive}
            />
        </div>
    );
}