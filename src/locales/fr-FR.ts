import component from './fr-FR/component';
import globalHeader from './fr-FR/globalHeader';
import menu from './fr-FR/menu';
import pwa from './fr-FR/pwa';
import settingDrawer from './fr-FR/settingDrawer';
import settings from './fr-FR/settings';


export default {
  'navBar.lang': 'Langues',
  'layout.user.link.help': 'Aidez-moi',
  'layout.user.link.privacy': 'politique de confidentialité',
  'layout.user.link.terms': 'Conditions de services',
  'app.preview.down.block': 'Téléchargez cette page dans votre projet local',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...settings,
  ...pwa,
  ...component,
};
