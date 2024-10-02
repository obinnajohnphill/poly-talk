import React, { useState, useEffect, useCallback } from 'react';
import { Platform, View, Text, Button, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import Voice from 'react-native-voice';  // For mobile speech recognition
import Tts from 'react-native-tts';  // For mobile text-to-speech

function App() {
  const [selectedSourceLanguage, setSelectedSourceLanguage] = useState('English (UK)');
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState('Spanish');
  const [recognizedText, setRecognizedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  const languages = [
    "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Assamese", "Aymara", "Azerbaijani",
    "Bambara", "Basque", "Belarusian", "Bengali", "Bhojpuri", "Bosnian", "Bulgarian", "Catalan",
    "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican", "Croatian", "Czech",
    "Danish", "Dhivehi", "Dogri", "Dutch", "English (UK)", "Esperanto", "Estonian", "Ewe", "Filipino (Tagalog)",
    "Finnish", "French", "Frisian", "Galician", "Georgian", "German", "Greek", "Guarani", "Gujarati",
    "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi", "Hmong", "Hungarian", "Icelandic", "Igbo",
    "Ilocano", "Indonesian", "Irish", "Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer",
    "Kinyarwanda", "Konkani", "Korean", "Krio", "Kurdish", "Kurdish (Sorani)", "Kyrgyz", "Lao", "Latin",
    "Latvian", "Lingala", "Lithuanian", "Luganda", "Luxembourgish", "Macedonian", "Maithili", "Malagasy",
    "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Meiteilon (Manipuri)", "Mizo", "Mongolian",
    "Myanmar (Burmese)", "Nepali", "Norwegian", "Nyanja (Chichewa)", "Odia (Oriya)", "Oromo", "Pashto",
    "Persian", "Polish", "Portuguese (Portugal, Brazil)", "Punjabi", "Quechua", "Romanian", "Russian",
    "Samoan", "Sanskrit", "Scots Gaelic", "Sepedi", "Serbian", "Sesotho", "Shona", "Sindhi", "Sinhala (Sinhalese)",
    "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish", "Tagalog (Filipino)",
    "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Tigrinya", "Tsonga", "Turkish", "Turkmen", "Twi (Akan)",
    "Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
  ];

  const getLanguageCode = (language) => {
    const languageMap = {
      "Afrikaans": "af", "Albanian": "sq", "Amharic": "am", "Arabic": "ar", "Armenian": "hy", "Assamese": "as",
      "Aymara": "ay", "Azerbaijani": "az", "Bambara": "bm", "Basque": "eu", "Belarusian": "be", "Bengali": "bn",
      "Bhojpuri": "bho", "Bosnian": "bs", "Bulgarian": "bg", "Catalan": "ca", "Cebuano": "ceb", "Chinese (Simplified)": "zh-CN",
      "Chinese (Traditional)": "zh-TW", "Corsican": "co", "Croatian": "hr", "Czech": "cs", "Danish": "da", "Dhivehi": "dv",
      "Dogri": "doi", "Dutch": "nl", "English": "en", "Esperanto": "eo", "Estonian": "et", "Ewe": "ee", "Filipino (Tagalog)": "fil",
      "Finnish": "fi", "French": "fr", "Frisian": "fy", "Galician": "gl", "Georgian": "ka", "German": "de", "Greek": "el",
      "Guarani": "gn", "Gujarati": "gu", "Haitian Creole": "ht", "Hausa": "ha", "Hawaiian": "haw", "Hebrew": "he", "Hindi": "hi",
      "Hmong": "hmn", "Hungarian": "hu", "Icelandic": "is", "Igbo": "ig", "Ilocano": "ilo", "Indonesian": "id", "Irish": "ga",
      "Italian": "it", "Japanese": "ja", "Javanese": "jv", "Kannada": "kn", "Kazakh": "kk", "Khmer": "km", "Kinyarwanda": "rw",
      "Konkani": "gom", "Korean": "ko", "Krio": "kri", "Kurdish": "ku", "Kurdish (Sorani)": "ckb", "Kyrgyz": "ky", "Lao": "lo",
      "Latin": "la", "Latvian": "lv", "Lingala": "ln", "Lithuanian": "lt", "Luganda": "lg", "Luxembourgish": "lb", "Macedonian": "mk",
      "Maithili": "mai", "Malagasy": "mg", "Malay": "ms", "Malayalam": "ml", "Maltese": "mt", "Maori": "mi", "Marathi": "mr",
      "Meiteilon (Manipuri)": "mni-Mtei", "Mizo": "lus", "Mongolian": "mn", "Myanmar (Burmese)": "my", "Nepali": "ne", "Norwegian": "no",
      "Nyanja (Chichewa)": "ny", "Odia (Oriya)": "or", "Oromo": "om", "Pashto": "ps", "Persian": "fa", "Polish": "pl",
      "Portuguese (Portugal, Brazil)": "pt", "Punjabi": "pa", "Quechua": "qu", "Romanian": "ro", "Russian": "ru", "Samoan": "sm",
      "Sanskrit": "sa", "Scots Gaelic": "gd", "Sepedi": "nso", "Serbian": "sr", "Sesotho": "st", "Shona": "sn", "Sindhi": "sd",
      "Sinhala (Sinhalese)": "si", "Slovak": "sk", "Slovenian": "sl", "Somali": "so", "Spanish": "es", "Sundanese": "su", "Swahili": "sw",
      "Swedish": "sv", "Tagalog (Filipino)": "tl", "Tajik": "tg", "Tamil": "ta", "Tatar": "tt", "Telugu": "te", "Thai": "th",
      "Tigrinya": "ti", "Tsonga": "ts", "Turkish": "tr", "Turkmen": "tk", "Twi (Akan)": "ak", "Ukrainian": "uk", "Urdu": "ur",
      "Uyghur": "ug", "Uzbek": "uz", "Vietnamese": "vi", "Welsh": "cy", "Xhosa": "xh", "Yiddish": "yi", "Yoruba": "yo", "Zulu": "zu"
    };
    return languageMap[language] || 'en';
  };

  const speakText = useCallback((text) => {
    if (Platform.OS === 'web') {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = getLanguageCode(selectedTargetLanguage);
      window.speechSynthesis.speak(utterance);
    } else {
      Tts.speak(text);
    }
  }, [selectedTargetLanguage]);

  const translateText = useCallback(async (text) => {
    const API_KEY = "AIzaSyAPtn6LjCUFWKQWJgWok3LM1IerKInoYJo";
    const sourceLangCode = getLanguageCode(selectedSourceLanguage);
    const targetLangCode = getLanguageCode(selectedTargetLanguage);

    try {
      const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
          { q: text, source: sourceLangCode, target: targetLangCode }
      );
      const translated = response.data.data.translations[0].translatedText;
      setTranslatedText(translated);
      speakText(translated);  // Play the translated text
    } catch (error) {
      console.error("Translation error:", error);
    }
  }, [selectedSourceLanguage, selectedTargetLanguage, speakText]);

  const startListeningWeb = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getLanguageCode(selectedSourceLanguage);
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setRecognizedText(spokenText);
      translateText(spokenText);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Voice.onSpeechResults = (event) => {
        const spokenText = event.value[0];
        setRecognizedText(spokenText);
        translateText(spokenText);
      };

      Voice.onSpeechStart = () => setIsListening(true);
      Voice.onSpeechEnd = () => setIsListening(false);

      return () => {
        Voice.destroy().then(Voice.removeAllListeners);
      };
    }
  }, [translateText]);

  const startListeningMobile = () => {
    if (Platform.OS !== 'web') {
      Voice.start(getLanguageCode(selectedSourceLanguage));
    }
  };

  const renderListenButton = () => {
    if (Platform.OS === 'web') {
      return (
          <Button
              title={isListening ? "Listening..." : "Start Listening"}
              onPress={startListeningWeb}
              disabled={isListening}
          />
      );
    } else {
      return (
          <Button
              title={isListening ? "Listening..." : "Start Listening"}
              onPress={startListeningMobile}
              disabled={isListening}
          />
      );
    }
  };

  return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>PolyTalk</Text>
          <Text style={styles.subHeaderText}>Effortless Conversation in Any Language</Text>
        </View>

        <View style={styles.pickerContainer}>
          <Text>Select Source Language</Text>
          <Picker
              selectedValue={selectedSourceLanguage}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedSourceLanguage(itemValue)}
          >
            {languages.map((language) => (
                <Picker.Item key={language} label={language} value={language} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Text>Select Target Language</Text>
          <Picker
              selectedValue={selectedTargetLanguage}
              style={styles.picker}
              onValueChange={(itemValue) => setSelectedTargetLanguage(itemValue)}
          >
            {languages.map((language) => (
                <Picker.Item key={language} label={language} value={language} />
            ))}
          </Picker>
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Recognized Text</Text>
          <TextInput
              style={styles.resultText}
              value={recognizedText}
              multiline
              editable={false}
          />
          <Text style={styles.resultLabel}>Translated Text</Text>
          <TextInput
              style={styles.resultText}
              value={translatedText}
              multiline
              editable={false}
          />
        </View>

        {renderListenButton()}
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f6f8',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  subHeaderText: {
    fontSize: 18,
    color: '#34495E',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  resultContainer: {
    marginTop: 20,
    width: '100%',
  },
  resultLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: '#34495E',
  },
  resultText: {
    fontSize: 16,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
});

export default App;
