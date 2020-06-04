// @flow

import color from 'color';
import {Platform, Dimensions, PixelRatio} from 'react-native';

export const PLATFORM = {
  ANDROID: 'android',
  IOS: 'ios',
  MATERIAL: 'material',
  WEB: 'web',
};

const brandPrimary = '#49d1b2';
const brandInfo = '#309cee';
const brandSuccess = '#48c774';
const brandDanger = '#ff3860';
const brandWarning = '#ffdd57';
const brandDark = '#0a0a0a';
const brandLight = '#f5f5f5';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const platform = Platform.OS;
const platformStyle = undefined;
const isIphoneX =
  platform === PLATFORM.IOS &&
  (deviceHeight === 812 ||
    deviceWidth === 812 ||
    deviceHeight === 896 ||
    deviceWidth === 896);

export default {
  platformStyle,
  platform,

  // Accordion
  headerStyle: '#edebed',
  iconStyle: '#0a0a0a',
  contentStyle: '#f5f4f5',
  expandedIconStyle: '#0a0a0a',
  accordionBorderColor: '#d3d3d3',

  // ActionSheet
  elevation: 4,
  containerTouchableBackgroundColor: brandDark,
  innerTouchableBackgroundColor: brandLight,
  listItemHeight: 50,
  listItemBorderColor: 'transparent',
  marginHorizontal: -15,
  marginLeft: 14,
  marginTop: 15,
  minHeight: 56,
  padding: 15,
  touchableTextColor: '#757575',

  // Android
  androidRipple: true,
  androidRippleColor: 'rgba(256, 256, 256, 0.3)',
  androidRippleColorDark: 'rgba(0, 0, 0, 0.15)',
  buttonUppercaseAndroidText: true,

  // Badge
  badgeBg: brandDanger,
  badgeColor: brandLight,
  badgePadding: platform === PLATFORM.IOS ? 3 : 0,

  // Button
  buttonFontFamily: platform === PLATFORM.IOS ? 'System' : 'System',
  buttonDisabledBg: '#b5b5b5',
  buttonPadding: 6,
  get buttonPrimaryBg() {
    return this.brandPrimary;
  },
  get buttonPrimaryColor() {
    return this.inverseTextColor;
  },
  get buttonInfoBg() {
    return this.brandInfo;
  },
  get buttonInfoColor() {
    return this.inverseTextColor;
  },
  get buttonSuccessBg() {
    return this.brandSuccess;
  },
  get buttonSuccessColor() {
    return this.inverseTextColor;
  },
  get buttonDangerBg() {
    return this.brandDanger;
  },
  get buttonDangerColor() {
    return this.inverseTextColor;
  },
  get buttonWarningBg() {
    return this.brandWarning;
  },
  get buttonWarningColor() {
    return this.inverseTextColor;
  },
  get buttonTextSize() {
    return platform === PLATFORM.IOS
      ? this.fontSizeBase * 1.1
      : this.fontSizeBase - 1;
  },
  get buttonTextSizeLarge() {
    return this.fontSizeBase * 1.5;
  },
  get buttonTextSizeSmall() {
    return this.fontSizeBase * 0.8;
  },
  get borderRadiusLarge() {
    return this.fontSizeBase * 3.8;
  },
  get iconSizeLarge() {
    return this.iconFontSize * 1.5;
  },
  get iconSizeSmall() {
    return this.iconFontSize * 0.6;
  },

  // Card
  cardDefaultBg: brandLight,
  cardBorderColor: '#ccc',
  cardBorderRadius: 2,
  cardItemPadding: platform === PLATFORM.IOS ? 10 : 12,

  // CheckBox
  CheckboxRadius: platform === PLATFORM.IOS ? 13 : 0,
  CheckboxBorderWidth: platform === PLATFORM.IOS ? 1 : 2,
  CheckboxPaddingLeft: platform === PLATFORM.IOS ? 4 : 2,
  CheckboxPaddingBottom: platform === PLATFORM.IOS ? 0 : 5,
  CheckboxIconSize: platform === PLATFORM.IOS ? 21 : 16,
  CheckboxIconMarginTop: platform === PLATFORM.IOS ? undefined : 1,
  CheckboxFontSize: platform === PLATFORM.IOS ? 23 / 0.9 : 17,
  checkboxBgColor: brandInfo,
  checkboxSize: 20,
  checkboxTickColor: brandLight,

  // Color
  brandPrimary,
  brandInfo,
  brandSuccess,
  brandDanger,
  brandWarning,
  brandDark,
  brandLight,

  // Container
  containerBgColor: brandLight,

  // Date Picker
  datePickerTextColor: brandDark,
  datePickerBg: 'transparent',

  // FAB
  fabWidth: 56,

  // Font
  DefaultFontSize: 16,
  fontFamily: platform === PLATFORM.IOS ? 'System' : 'System',
  fontSizeBase: 15,
  get fontSizeH1() {
    return this.fontSizeBase * 1.8;
  },
  get fontSizeH2() {
    return this.fontSizeBase * 1.6;
  },
  get fontSizeH3() {
    return this.fontSizeBase * 1.4;
  },

  // Footer
  footerHeight: 55,
  footerDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  footerPaddingBottom: 0,

  // FooterTab
  tabBarTextColor: platform === PLATFORM.IOS ? '#737373' : '#bfc6ea',
  tabBarTextSize: platform === PLATFORM.IOS ? 14 : 11,
  activeTab: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  sTabBarActiveTextColor: '#007aff',
  tabBarActiveTextColor: platform === PLATFORM.IOS ? '#2874F0' : brandLight,
  tabActiveBgColor: platform === PLATFORM.IOS ? '#cde1f9' : '#3F51B5',

  // Header
  toolbarBtnColor: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  toolbarDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : brandLight,
  toolbarHeight: platform === PLATFORM.IOS ? 64 : 56,
  toolbarSearchIconSize: platform === PLATFORM.IOS ? 20 : 23,
  toolbarInputColor: platform === PLATFORM.IOS ? '#CECDD2' : brandLight,
  searchBarHeight: platform === PLATFORM.IOS ? 30 : 40,
  searchBarInputHeight: platform === PLATFORM.IOS ? 30 : 50,
  toolbarBtnTextColor: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  iosStatusbar: 'dark-content',
  toolbarDefaultBorder: platform === PLATFORM.IOS ? '#a7a6ab' : '#3F51B5',
  get statusBarColor() {
    return color(this.toolbarDefaultBg)
      .darken(0.2)
      .hex();
  },
  get darkenHeader() {
    return color(this.tabBgColor)
      .darken(0.03)
      .hex();
  },

  // Icon
  iconFamily: 'Ionicons',
  iconFontSize: platform === PLATFORM.IOS ? 30 : 28,
  iconHeaderSize: platform === PLATFORM.IOS ? 33 : 24,

  // InputGroup
  inputFontSize: 17,
  inputBorderColor: '#D9D5DC',
  inputSuccessBorderColor: brandSuccess,
  inputErrorBorderColor: brandDanger,
  inputHeightBase: 50,
  get inputColor() {
    return this.textColor;
  },
  get inputColorPlaceholder() {
    return '#575757';
  },

  // Line Height
  buttonLineHeight: 19,
  lineHeightH1: 32,
  lineHeightH2: 27,
  lineHeightH3: 22,
  lineHeight: platform === PLATFORM.IOS ? 20 : 24,

  // List
  listBg: 'transparent',
  listBorderColor: '#c9c9c9',
  listDividerBg: '#f5f5f5',
  listBtnUnderlayColor: '#DDD',
  listItemPadding: platform === PLATFORM.IOS ? 10 : 12,
  listNoteColor: '#808080',
  listNoteSize: 13,
  listItemSelected: platform === PLATFORM.IOS ? '#007aff' : '#3F51B5',

  // Progress Bar
  defaultProgressColor: brandDanger,
  inverseProgressColor: '#1A191B',

  // Radio Button
  radioBtnSize: platform === PLATFORM.IOS ? 25 : 23,
  radioSelectedColorAndroid: '#3F51B5',
  radioBtnLineHeight: platform === PLATFORM.IOS ? 29 : 24,
  get radioColor() {
    return this.brandPrimary;
  },

  // Segment
  segmentBackgroundColor: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  segmentActiveBackgroundColor:
    platform === PLATFORM.IOS ? '#007aff' : brandLight,
  segmentTextColor: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  segmentActiveTextColor: platform === PLATFORM.IOS ? brandLight : '#3F51B5',
  segmentBorderColor: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  segmentBorderColorMain: platform === PLATFORM.IOS ? '#a7a6ab' : '#3F51B5',

  // Spinner
  defaultSpinnerColor: brandPrimary,
  inverseSpinnerColor: '#1A191B',

  // Tab
  tabDefaultBg: platform === PLATFORM.IOS ? '#F8F8F8' : '#3F51B5',
  topTabBarTextColor: platform === PLATFORM.IOS ? '#6b6b6b' : '#b3c7f9',
  topTabBarActiveTextColor: platform === PLATFORM.IOS ? '#007aff' : brandLight,
  topTabBarBorderColor: platform === PLATFORM.IOS ? '#a7a6ab' : brandLight,
  topTabBarActiveBorderColor:
    platform === PLATFORM.IOS ? '#007aff' : brandLight,

  // Tabs
  tabBgColor: '#F8F8F8',
  tabFontSize: 15,

  // Text
  textColor: brandDark,
  inverseTextColor: brandLight,
  noteFontSize: 14,
  get defaultTextColor() {
    return this.textColor;
  },

  // Title
  titleFontfamily: platform === PLATFORM.IOS ? 'System' : 'System',
  titleFontSize: platform === PLATFORM.IOS ? 17 : 19,
  subTitleFontSize: platform === PLATFORM.IOS ? 11 : 14,
  subtitleColor: platform === PLATFORM.IOS ? '#0a0a0a' : brandDark,
  titleFontColor: platform === PLATFORM.IOS ? '#0a0a0a' : brandDark,

  // Other
  borderRadiusBase: platform === PLATFORM.IOS ? 5 : 2,
  borderWidth: 1 / PixelRatio.getPixelSizeForLayoutSize(1),
  contentPadding: 10,
  dropdownLinkColor: '#414142',
  inputLineHeight: 24,
  deviceWidth,
  deviceHeight,
  isIphoneX,
  inputGroupRoundedBorderRadius: 30,

  // iPhoneX SafeArea
  Inset: {
    portrait: {
      topInset: 24,
      leftInset: 0,
      rightInset: 0,
      bottomInset: 34,
    },
    landscape: {
      topInset: 0,
      leftInset: 44,
      rightInset: 44,
      bottomInset: 21,
    },
  },
};
