import React from 'react';
import { CompanyInfoProfile, StudioTemplateConfig } from './studioTypes';
import { CorporateFlagshipTemplate } from './templates/company/CorporateFlagshipTemplate';
import { CompanyBentoTemplate } from './templates/company/CompanyBentoTemplate';
import { CompanyMinimalistTemplate } from './templates/company/CompanyMinimalistTemplate';
import { CompanyIndustrialTemplate } from './templates/company/CompanyIndustrialTemplate';

interface TabCompanyViewProps {
  company: CompanyInfoProfile;
  onChangeCompany: (company: CompanyInfoProfile) => void;
  config: StudioTemplateConfig;
  isReadOnly?: boolean;
}

export const TabCompanyView: React.FC<TabCompanyViewProps> = ({
  company,
  onChangeCompany,
  config,
  isReadOnly = false,
}) => {
  const activeTemplate = config.activeCompanyTemplateId || 'corporate-flagship';

  switch (activeTemplate) {
    case 'modern-bento':
      return (
        <CompanyBentoTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'minimalist':
      return (
        <CompanyMinimalistTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'industrial-impact':
      return (
        <CompanyIndustrialTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'corporate-flagship':
    default:
      return (
        <CorporateFlagshipTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
  }
};
