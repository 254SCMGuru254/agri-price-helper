import { useLanguage } from "@/components/LanguageContext";

export const ChartFooter = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-4 text-xs text-muted-foreground">
      <p>
        Data Source: Not available / Feature removed
      </p>
      <p>
        {t('stats.lastUpdated') || 'Last Updated'}: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
};
