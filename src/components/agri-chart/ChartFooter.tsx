
import { useLanguage } from "@/components/LanguageContext";

export const ChartFooter = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 text-xs text-muted-foreground">
      <p>
        {t('stats.dataSource') || 'Data Source'}: Kenya Agricultural Statistics
      </p>
      <p>
        {t('stats.lastUpdated') || 'Last Updated'}: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};
