import React from 'react';
import ServicePage from './ServicePage';
import { useLanguage } from '../contexts/LanguageContext';

const DefenseProjects: React.FC = () => {
  const { language } = useLanguage();
  
  const featuresKey = language === 'tr' 
    ? ['service3.feature1', 'service3.feature2', 'service3.feature3', 'service3.feature4']
    : ['service3.feature1', 'service3.feature2', 'service3.feature3', 'service3.feature4'];
    
  const processKey = language === 'tr'
    ? ['service3.process1', 'service3.process2', 'service3.process3', 'service3.process4']
    : ['service3.process1', 'service3.process2', 'service3.process3', 'service3.process4'];

  // Map each feature to its image
  const featureImagesMap: Record<string, string> = {
    'service3.feature1': '/assets/images/defense1.png',
    'service3.feature2': '/assets/images/defense2.png',
    'service3.feature3': '/assets/images/defense3.png',
    'service3.feature4': '/assets/images/defense4.png',
  };

  return (
    <ServicePage
      titleKey="services.service3.title"
      subtitleKey="service3.subtitle"
      descriptionKey="service3.description"
      featuresKey={featuresKey}
      processKey={processKey}
      customBackground="white"
      heroBackgroundImage="/assets/images/bg4.png"
      centerFeatures={true}
      hideCTATitle={true}
      featureImagesMap={featureImagesMap}
    />
  );
};

export default DefenseProjects;
