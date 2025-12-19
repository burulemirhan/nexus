import React from 'react';
import ServicePage from './ServicePage';
import { useLanguage } from '../contexts/LanguageContext';

const EngineeringSolutions: React.FC = () => {
  const { language } = useLanguage();
  
  const featuresKey = language === 'tr' 
    ? ['service1.feature1', 'service1.feature2', 'service1.feature3', 'service1.feature4']
    : ['service1.feature1', 'service1.feature2', 'service1.feature3', 'service1.feature4'];
    
  const processKey = language === 'tr'
    ? ['service1.process1', 'service1.process2', 'service1.process3', 'service1.process4']
    : ['service1.process1', 'service1.process2', 'service1.process3', 'service1.process4'];

  return (
    <ServicePage
      titleKey="services.service1.title"
      subtitleKey="service1.subtitle"
      descriptionKey="service1.description"
      featuresKey={featuresKey}
      processKey={processKey}
      customBackground="white"
      heroBackgroundImage="/assets/images/bg2.avif"
      featureImages={['/assets/images/vfd.avif', '/assets/images/ghd.avif', '/assets/images/fieldd.avif']}
    />
  );
};

export default EngineeringSolutions;
