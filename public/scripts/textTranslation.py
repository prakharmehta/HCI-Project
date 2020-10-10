from googletrans import Translator
import sys

translator = Translator()
# outputFile = open(sys.argv[1])
with open(sys.argv[1], "r") as f:
    data = f.read()
    translatedOutput = translator.translate(data, dest=sys.argv[2])
    with open("./models/translationOutput/translatedText.txt", "w") as t:
        t.write(str(translatedOutput.text))

print(translatedOutput.text)
# outputFile.write(translatedOutput)