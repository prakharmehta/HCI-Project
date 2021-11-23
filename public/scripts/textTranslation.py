from googletrans import Translator
import sys

translator = Translator()
# outputFile = open(sys.argv[1])
data = sys.argv[1]
translatedOutput = translator.translate(data, dest=sys.argv[2])
    # with open("./models/translationOutput/translatedText.txt", "w") as t:
    #     t.write(str(translatedOutput.text))

print(translatedOutput.text)
# outputFile.write(translatedOutput)