import React from 'react';
import { 
  SalemanPersonalProfile, 
  StudioTemplateConfig 
} from './studioTypes';
import { ExecutiveEliteTemplate } from './templates/ExecutiveEliteTemplate';
import { ModernBentoTemplate } from './templates/ModernBentoTemplate';
import { MinimalistTemplate } from './templates/MinimalistTemplate';
import { BoldCompactTemplate } from './templates/BoldCompactTemplate';

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
