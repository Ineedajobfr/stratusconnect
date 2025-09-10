import fs from 'fs';
import path from 'path';

const files = [
  'src/components/AdvancedAnalytics.tsx',
  'src/components/BillingSystem.tsx',
  'src/components/ContractManagement.tsx',
  'src/components/EnhancedMarketplace.tsx',
  'src/components/EnhancedMessaging.tsx',
  'src/components/EscrowManagement.tsx',
  'src/components/FleetManagement.tsx',
  'src/components/MarketIntelligence.tsx',
  'src/components/Marketplace.tsx',
  'src/components/MessagingSystem.tsx',
  'src/components/NotificationCenter.tsx',
  'src/components/ProfileWidget.tsx',
  'src/components/ReputationSystem.tsx',
  'src/components/SanctionsScreening.tsx',
  'src/components/StrikeManagement.tsx',
  'src/components/UserProfile.tsx',
  'src/components/messaging/MessageCenter.tsx',
  'src/components/psych/PsychReport.tsx',
  'src/components/reviews/ReviewsList.tsx',
  'src/components/ui/notification-center.tsx',
  'src/hooks/usePageContent.ts',
  'src/pages/ProfileSettings.tsx',
  'src/pages/SecureAdminSetup.tsx'
];

let totalFixed = 0;

files.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let fileFixed = 0;
    
    // Fix useCallback(async () { pattern to useCallback(async () => {
    const pattern = /useCallback\(async \(\) \{/g;
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, 'useCallback(async () => {');
      fileFixed += matches.length;
    }
    
    // Fix useCallback(() { pattern to useCallback(() => {
    const pattern2 = /useCallback\(\(\) \{/g;
    const matches2 = content.match(pattern2);
    if (matches2) {
      content = content.replace(pattern2, 'useCallback(() => {');
      fileFixed += matches2.length;
    }
    
    if (fileFixed > 0) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed ${fileFixed} syntax errors in ${filePath}`);
      totalFixed += fileFixed;
    }
  }
});

console.log(`Total syntax errors fixed: ${totalFixed}`);
