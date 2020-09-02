from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals
 
from sumy.parsers.html import HtmlParser
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lsa import LsaSummarizer
from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words
 
from sumy.summarizers.luhn import LuhnSummarizer
from sumy.summarizers.edmundson import EdmundsonSummarizer   #found this is the best as 
# it is picking from beginning also while other skip
 
 
LANGUAGE = "english"
SENTENCES_COUNT = 10
 
 
if __name__ == "__main__":
    
    parser = PlaintextParser.from_file("C:/Users/Anish Bhagat/Desktop/internship/summerizer/Excerpt1.txt", Tokenizer(LANGUAGE))
    
 
        
    print ("--LsaSummarizer--")    
    summarizer = LsaSummarizer()
    summarizer = LsaSummarizer(Stemmer(LANGUAGE))
    summarizer.stop_words = get_stop_words(LANGUAGE)
    for sentence in summarizer(parser.document, SENTENCES_COUNT):
        print(sentence)
         
    print ("--LuhnSummarizer--")     
    summarizer = LuhnSummarizer() 
    summarizer = LsaSummarizer(Stemmer(LANGUAGE))
    summarizer.stop_words = ("I", "am", "the", "you", "are", "me", "is", "than", "that", "this",)
    for sentence in summarizer(parser.document, SENTENCES_COUNT):
        print(sentence)
         
    print ("--EdmundsonSummarizer--")     
    summarizer = EdmundsonSummarizer() 
    words = ("deep", "learning", "neural" )
    summarizer.bonus_words = words
     
    words = ("another", "and", "some", "next",)
    summarizer.stigma_words = words
    
     
    words = ("another", "and", "some", "next",)
    summarizer.null_words = words
    for sentence in summarizer(parser.document, SENTENCES_COUNT):
        print(sentence)  
