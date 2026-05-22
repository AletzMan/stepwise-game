import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from './Button';

interface LanguageToggleProps {
    className?: string;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ className = '' }) => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'es' ? 'en' : 'es';
        i18n.changeLanguage(nextLang);
        localStorage.setItem('language', nextLang);
    };

    return (
        <Button
            intent="accent"
            color="cyan"
            size="sm"
            onClick={toggleLanguage}
            className={`font-black tracking-wider transition-all duration-300 gap-1.5 min-w-[70px] justify-center ${className}`}
        >
            <Languages size={14} strokeWidth={2.5} />
            <span className="font-jetbrains text-xs">{i18n.language === 'es' ? 'ES' : 'EN'}</span>
        </Button>
    );
};

export default LanguageToggle;
