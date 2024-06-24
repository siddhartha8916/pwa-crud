type TranslationKeys = {
  userNamePlaceholderText: string;
  userNameAddButtonText: string;
  userNameAddingButtonText: string;
  userLocationPlaceholderText: string;
  userLocationButtonText: string;
  pushNotificationButtonText: string;
  applicationName: string;
};

type TranslationsType = {
  [key: string]: TranslationKeys; // Index signature allowing any string key with value of type TranslationKeys
};

export const translations: TranslationsType = {
  english: {
    userNamePlaceholderText: "Please enter username",
    userNameAddButtonText: "Add User",
    userNameAddingButtonText: "Adding User",
    userLocationPlaceholderText: "Please enter location",
    userLocationButtonText: "Get Location",
    pushNotificationButtonText: "Subscribe to Push Notifications",
    applicationName: "PWA Survey App",
  },
  hindi: {
    userNamePlaceholderText: "कृपया उपयोक्ता नाम दर्ज करें",
    userNameAddButtonText: "उपयोक्ता जोड़ें",
    userNameAddingButtonText: "उपयोक्ता जोड़ा जा रहा है",
    userLocationPlaceholderText: "कृपया स्थान दर्ज करें",
    userLocationButtonText: "स्थान प्राप्त करें",
    pushNotificationButtonText: "पुष्टि सूचनाएँ सदस्यता लें",
    applicationName: "PWA सर्वेक्षण ऐप",
  },
};
