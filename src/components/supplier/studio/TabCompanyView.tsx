import React from 'react';
import { CompanyInfoProfile, StudioTemplateConfig } from './studioTypes';
import { CorporateFlagshipTemplate } from './templates/company/CorporateFlagshipTemplate';
import { CorporateHeritageTemplate } from './templates/company/CorporateHeritageTemplate';
import { ExecutivePillarTemplate } from './templates/company/ExecutivePillarTemplate';
import { CompanyBentoTemplate } from './templates/company/CompanyBentoTemplate';
import { SupplyChainTechTemplate } from './templates/company/SupplyChainTechTemplate';
import { StaggeredCardsTemplate } from './templates/company/StaggeredCardsTemplate';
import { GlassmorphismLuxuryTemplate } from './templates/company/GlassmorphismLuxuryTemplate';
import { CleanDirectoryTemplate } from './templates/company/CleanDirectoryTemplate';
import { CompanyIndustrialTemplate } from './templates/company/CompanyIndustrialTemplate';
import { CommercialSpotlightTemplate } from './templates/company/CommercialSpotlightTemplate';

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
    case 'corporate-heritage':
      return (
        <CorporateHeritageTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'executive-pillar':
      return (
        <ExecutivePillarTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'modern-bento':
      return (
        <CompanyBentoTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'supply-chain-tech':
      return (
        <SupplyChainTechTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'staggered-cards':
      return (
        <StaggeredCardsTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'glassmorphism-luxury':
      return (
        <GlassmorphismLuxuryTemplate
          company={company}
          onChangeCompany={onChangeCompany}
          config={config}
          isReadOnly={isReadOnly}
        />
      );
    case 'clean-directory':
      return (
        <CleanDirectoryTemplate
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
    case 'commercial-spotlight':
      return (
        <CommercialSpotlightTemplate
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
