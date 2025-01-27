import { ErrorBoundary } from 'app/providers/ErrorBoundary';
import { Background } from 'shared/ui/Background/Background';
import { useTranslation } from 'react-i18next';
import { backgroundUrl } from '../utils/tabsConfig';
import cls from './TeamsPage.module.scss';

const TeamsPage = () => {
  const { t } = useTranslation('teamPage');
  return (
    <ErrorBoundary>
      <Background url={backgroundUrl} theme="image" />
      <div className={cls.teams}>
        <div className={cls.wrapper}>
          <h1 className={cls.title}>
            {t('UNDER_CONSTRUCTION')}
          </h1>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TeamsPage;
