import React from 'react';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig 
} from './studioTypes';
import { ExecutiveEliteTemplate } from './templates/ExecutiveEliteTemplate';
import { ModernBentoTemplate } from './templates/ModernBentoTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { BoldCompactTemplate } from './templates/BoldCompactTemplate';
import { ClassicPrestigeTemplate } from './templates/ClassicPrestigeTemplate';
import { PrimeExperienceTemplate } from './templates/PrimeExperienceTemplate';
import { GrandBannerTemplate } from './templates/GrandBannerTemplate';
import { CleanEleganceTemplate } from './templates/CleanEleganceTemplate';
import { ModularMatrixTemplate } from './templates/ModularMatrixTemplate';
import { SpeedHunterTemplate } from './templates/SpeedHunterTemplate';

interface TabProfileTemplateRendererProps {
  profile: SalemanPersonalProfile;
  onChangeProfile: (profile: SalemanPersonalProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const TabProfileTemplateRenderer: React.FC<TabProfileTemplateRendererProps> = ({
  profile,
  onChangeProfile,
  config,
  isReadOnly = false,
}) => {
  switch (config.activeTemplateId) {
    case 'modern-bento':
      return (
        <ModernBentoTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'minimalist':
      return (
        <MinimalistTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'bold-compact':
      return (
        <BoldCompactTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'classic-prestige':
      return (
        <ClassicPrestigeTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'prime-experience':
      return (
        <PrimeExperienceTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'grand-banner':
      return (
        <GrandBannerTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'clean-elegance':
      return (
        <CleanEleganceTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'modular-matrix':
      return (
        <ModularMatrixTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'speed-hunter':
      return (
        <SpeedHunterTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'executive-elite':
    default:
      return (
        <ExecutiveEliteTemplate
          profile={profile}
          onChangeProfile={onChangeProfile}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
  }
};
