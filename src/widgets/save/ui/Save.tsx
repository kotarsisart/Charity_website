import { useState } from "react";
import styles from './styles.module.scss';
import { HelpBtn } from "@/shared/ui/help-button";
import OneTimeTab from "@/features/one-time-help-tab/ui/OneTimeTab";
import { JuridicPeopleTab } from "@/features/juridic-people-tab";
import { CryptoMonoTab } from "@/features/crypto-mono-tab";
import { useMediaQuery } from "react-responsive";
import { DonateWays } from "@/features/donate-ways";
import { Button } from "@/shared/ui/button";
import { useTranslation } from "react-i18next";
import { ForeignAccTab } from "@/features/foreign-acc-tab";

const Save = () => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "one-time",
      label: t('oneTime'),
      content: (
        <OneTimeTab />
      ),
    },
    {
      id: "judge-person",
      label: t('juridic'),
      content: (
        <JuridicPeopleTab />
      ),
    },
    {
      id: "foreign-acc",
      label: t('foregTitle'),
      content: (
        <ForeignAccTab />
      ),
    },
    
    {
      id: "monobank",
      label: t('monobank'),
      content: (
        <CryptoMonoTab title={t('doMono')} />
      ),
    },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isKindDonate, setIsKindDonate] = useState(false);
  const isTablet = useMediaQuery({ query: '(max-width: 1310px)' });

  return ( 
    <section className={styles.section}>
      <div className={styles.topContent}>
        <div className="container">
          <h2 className={styles.title}>{t('helpCountry')}</h2>
          <h6 className={styles.subtitle}>{t('everyGrn')}</h6>
          {!isTablet ? <div className={styles.tabs}>
            {tabs.map((tab) => (
              <HelpBtn key={tab.id} onClick={() => setActiveTab(tab.id)} isactive={activeTab === tab.id}>
            {tab.label}
            </HelpBtn>
        ))}
          </div> :
            (<Button variant="usual" onClick={() => setIsKindDonate(false)} >{!isKindDonate ? t('paymWayDon'): t('changePayWay')}</Button>)}
        </div>
      </div>
      <div className="container">
        <div className={styles.bottom}>
          {(!isKindDonate && isTablet) && <DonateWays activeTab={activeTab} onActiveTab={setActiveTab} onKindDonate={setIsKindDonate} />}
          {(isKindDonate || !isTablet) && tabs.find((tab) => tab.id=== activeTab)?.content}
        </div>
      </div>
    </section>
   );
}
 
export default Save;