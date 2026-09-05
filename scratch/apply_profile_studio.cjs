const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('src/components/supplier/SupplierProfileEditPage.tsx');

let content = fs.readFileSync(targetFile, 'utf8');
const isCRLF = content.includes('\r\n');
if (isCRLF) {
  content = content.replace(/\r\n/g, '\n');
}

// 1. Add Studio imports
const oldImports = `import { SupplierProfileDetailPage } from '../public/SupplierProfileDetailPage';
import { SupplierServiceCapabilityModal } from './SupplierServiceCapabilityModal';`;

const newImports = `import { SupplierProfileDetailPage } from '../public/SupplierProfileDetailPage';
import { SupplierServiceCapabilityModal } from './SupplierServiceCapabilityModal';
import { 
  StudioTemplateConfig, 
  SalemanPersonalProfile, 
  CompanyInfoProfile 
} from './studio/studioTypes';
import { 
  initialSalemanProfile, 
  initialCompanyProfile, 
  initialStudioConfig 
} from './studio/mockStudioData';
import { StudioToolbar } from './studio/StudioToolbar';
import { TemplateSelectorModal } from './studio/TemplateSelectorModal';
import { TabProfileTemplateRenderer } from './studio/TabProfileTemplateRenderer';
import { TabCompanyView } from './studio/TabCompanyView';
import { TabPerformanceReviews } from './studio/TabPerformanceReviews';`;

if (!content.includes(oldImports)) {
  console.error("Could not find oldImports!");
  process.exit(1);
}
content = content.replace(oldImports, newImports);

// 2. Locate starting from activeEditorTab state
const stateMarker = `  // Active Tab inside Editor
  const [activeEditorTab, setActiveEditorTab] = useState<
    'basic' | 'metrics' | 'services' | 'rateCard' | 'achievements' | 'certifications' | 'testimonials'
  >('basic');`;

const newStateMarker = `  // Active Tab inside Studio (4 core tabs)
  const [activeEditorTab, setActiveEditorTab] = useState<
    'profile' | 'company' | 'services' | 'performance'
  >('profile');

  // Studio Template Configuration State
  const [studioConfig, setStudioConfig] = useState<StudioTemplateConfig>(initialStudioConfig);

  // Saleman Personal Profile State (TopCV Style)
  const [salemanProfile, setSalemanProfile] = useState<SalemanPersonalProfile>(initialSalemanProfile);

  // Company Information State
  const [companyProfile, setCompanyProfile] = useState<CompanyInfoProfile>(initialCompanyProfile);

  // Template Selector Modal Visibility
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false);`;

if (!content.includes(stateMarker)) {
  console.error("Could not find stateMarker!");
  process.exit(1);
}
content = content.replace(stateMarker, newStateMarker);

// 3. Update handleSaveProfile to sync data between studio profiles and profile
const saveMarker = `  // Save Handler
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // In-memory update of mockSalesSpecialists
    const index = mockSalesSpecialists.findIndex((s) => s.id === profile.id);
    if (index !== -1) {
      mockSalesSpecialists[index] = JSON.parse(JSON.stringify(profile));
    }

    if (onSaveSuccess) {
      onSaveSuccess(profile);
    }

    setIsSaved(true);
    setSaveToast('Đã lưu và cập nhật hồ sơ hiển thị công khai thành công!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveToast(null);
    }, 4000);
  };`;

const newSaveMarker = `  // Save Handler
  const handleSaveProfile = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Sync studio data into the main profile
    const updatedProfile: SalesSpecialistProfile = {
      ...profile,
      name: salemanProfile.name,
      vietnameseName: salemanProfile.vietnameseName,
      title: salemanProfile.title,
      motto: salemanProfile.motto,
      bio: salemanProfile.bio,
      phone: salemanProfile.phone,
      email: salemanProfile.email,
      specialties: salemanProfile.specialties,
      languages: salemanProfile.languages,
      companyName: companyProfile.companyName,
      companyNameEn: companyProfile.companyNameEn,
      companyBio: companyProfile.companyBio,
      taxId: companyProfile.taxId,
      avatarUrl: salemanProfile.avatarUrl || profile.avatarUrl,
      avatarInitial: salemanProfile.avatarInitial || profile.avatarInitial,
    };
    setProfile(updatedProfile);

    // In-memory update of mockSalesSpecialists
    const index = mockSalesSpecialists.findIndex((s) => s.id === profile.id);
    if (index !== -1) {
      mockSalesSpecialists[index] = JSON.parse(JSON.stringify(updatedProfile));
    }

    if (onSaveSuccess) {
      onSaveSuccess(updatedProfile);
    }

    setIsSaved(true);
    setSaveToast('Đã lưu toàn bộ hồ sơ Saleman & Doanh nghiệp thành công!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveToast(null);
    }, 4000);
  };`;

if (!content.includes(saveMarker)) {
  console.error("Could not find saveMarker!");
  process.exit(1);
}
content = content.replace(saveMarker, newSaveMarker);

// 4. Locate from the old Verification Summary Banner all the way down to the closing of the tabs
const oldBannerStart = `      {/* Verification & Live Visibility Summary Banner */}`;
const oldTabsEnd = `      {/* Bottom Sticky Floating Save Bar */}`;

const startIndex = content.indexOf(oldBannerStart);
const endIndex = content.indexOf(oldTabsEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find banner start or bottom bar marker!", { startIndex, endIndex });
  process.exit(1);
}

const newMiddleSection = `      {/* Studio TopCV Toolbar */}
      <StudioToolbar
        config={studioConfig}
        onChangeConfig={setStudioConfig}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
        onPreview={() => setViewMode('preview')}
        onSave={() => handleSaveProfile()}
        onReset={handleReset}
      />

      {/* Editor Navigation Tabs (4 Core Studio Tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs scrollbar-thin">
        {[
          { id: 'profile', label: '1. Hồ Sơ Chuyên Viên (My Profile)', icon: User, count: null },
          { id: 'company', label: '2. Pháp Nhân & Doanh Nghiệp (My Company)', icon: Building2, count: null },
          { id: 'services', label: '3. Danh Mục Dịch Vụ & Bảng Cước', icon: Truck, count: profile.services.length },
          { id: 'performance', label: '4. Chỉ Số Hiệu Suất & Đánh Giá (Reviews)', icon: TrendingUp, count: 142 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeEditorTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveEditorTab(tab.id as any)}
              className={\`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer \${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }\`}
            >
              <Icon className={\`w-4 h-4 \${isActive ? 'text-white' : 'text-indigo-600'}\`} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className={\`px-1.5 py-0.2 rounded-md text-[10px] font-black \${
                  isActive ? 'bg-indigo-800 text-indigo-100' : 'bg-slate-200 text-slate-700'
                }\`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: SALEMAN PERSONAL PROFILE (TOPCV STUDIO TEMPLATE ENGINE)
      ========================================================================= */}
      {activeEditorTab === 'profile' && (
        <TabProfileTemplateRenderer
          profile={salemanProfile}
          onChangeProfile={setSalemanProfile}
          config={studioConfig}
          isReadOnly={false}
        />
      )}

      {/* =========================================================================
          TAB 2: COMPANY INFORMATION & CREDENTIALS
      ========================================================================= */}
      {activeEditorTab === 'company' && (
        <TabCompanyView
          company={companyProfile}
          onChangeCompany={setCompanyProfile}
          config={studioConfig}
          isReadOnly={false}
        />
      )}

      {/* =========================================================================
          TAB 3: SERVICES & PRICING (INLINE FULL CAPABILITY TREE)
      ========================================================================= */}
      {activeEditorTab === 'services' && (
        <div className="space-y-6">
          <SupplierServiceCapabilityModal
            isInline={true}
            onSave={handleSaveCapabilityServices}
            existingServices={profile.services}
          />
        </div>
      )}

      {/* =========================================================================
          TAB 4: PERFORMANCE METRICS & CLIENT TESTIMONIALS
      ========================================================================= */}
      {activeEditorTab === 'performance' && (
        <TabPerformanceReviews config={studioConfig} />
      )}

`;

content = content.substring(0, startIndex) + newMiddleSection + content.substring(endIndex);

// 5. Append TemplateSelectorModal before the final closing div
const finalClosingDiv = `      {/* Bottom Sticky Floating Save Bar */}`;
const modalInsertion = `      {/* TopCV Style Template Selector Modal */}
      <TemplateSelectorModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        selectedTemplateId={studioConfig.activeTemplateId}
        onSelectTemplate={(tplId) => {
          setStudioConfig((prev) => ({ ...prev, activeTemplateId: tplId }));
        }}
        selectedThemeColor={studioConfig.themeColor}
        onSelectThemeColor={(cId) => {
          setStudioConfig((prev) => ({ ...prev, themeColor: cId }));
        }}
      />

      {/* Bottom Sticky Floating Save Bar */}`;

if (!content.includes(finalClosingDiv)) {
  console.error("Could not find finalClosingDiv!");
  process.exit(1);
}
content = content.replace(finalClosingDiv, modalInsertion);

if (isCRLF) {
  content = content.replace(/\n/g, '\r\n');
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Successfully applied Profile Studio to SupplierProfileEditPage.tsx!');
