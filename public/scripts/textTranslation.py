from google_trans_new import google_translator  
import sys

# translator = Translator()
  
translator = google_translator()
# outputFile = open(sys.argv[1])
data = sys.argv[1]
translatedOutput = translator.translate(data, dest=sys.argv[2])
    # with open("./models/translationOutput/translatedText.txt", "w") as t:
    #     t.write(str(translatedOutput.text))

print(translatedOutput.text)
# outputFile.write(translatedOutput)