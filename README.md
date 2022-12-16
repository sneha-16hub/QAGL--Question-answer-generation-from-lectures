# QAGL:Question Answer Generation from Lectures

## Screenshots
![register](https://user-images.githubusercontent.com/60435967/208156471-7ccef35f-9dde-4f2d-8cdc-d744955d7f8e.png)
![login](https://user-images.githubusercontent.com/60435967/208157082-eb705fd7-4219-4962-b839-c9c279a3c460.png)
![up](https://user-images.githubusercontent.com/60435967/208156405-15d7b197-f955-4d76-be76-fee84077503c.png)
![sub](https://user-images.githubusercontent.com/60435967/208156420-64a9f933-4d9d-4645-b0fd-5d18011b4714.png)
![text](https://user-images.githubusercontent.com/60435967/208156414-a023cf81-6bbd-492f-bc49-d385b6e9636f.png)
![sum](https://user-images.githubusercontent.com/60435967/208156427-33f04da8-4dde-42e0-8029-bd7cc67ea5d6.png)
![Screenshot 2022-12-16 225548](https://user-images.githubusercontent.com/60435967/208156477-a97e3333-61f6-4a6d-9dc2-39afa3210523.png)

## Problem Statement

Over the past few years, the education system has changed drastically with Digital
learning facilitated by technology that offers students some factors of command over
the place, time, pace, and path. The COVID-19 crisis has forced education systems
worldwide to find alternatives to face-to-face instruction. As a result, online teaching
and learning have been used by teachers and students on an unprecedented
scale. Digital learning is replacing traditional educational procedures more and more
each day. In a recent survey, nearly three-quarters of students - 73 percent – said they
would prefer to take some of their courses fully online post-pandemic, however only
half of the faculty (53 percent) felt the same about teaching online. Sixty-eight percent
of students were also in favour of some combination of in-person and online courses.
On the faculty side, 57 percent said they would prefer teaching hybrid courses postpandemic
— slightly more than those who preferred teaching fully online. The survey
also gauged respondents' preferences around using more technology, digital materials
and digital resources for post-pandemic teaching and learning. Here, both students and
faculty agreed: Roughly two-thirds across the board said they would like to use more
tech and digital course materials in the future. With such huge demands the future of
education is quite clear and hence we have come up with the necessary improvements
in the current digital education system.
The current digital system have resources but lack proper demonstration of the same,
Students find it quite difficult to repeatedly go through the more than 60 min long
videos and end up shifting to other resources available online. In order to solve this
problem and make student learning experience more interesting and engaging we came
up with a solution. Our project aims towards designing an interface that can facilitate
students to learn more efficiently through our web portal with advanced features like
speech-to-text generation. Most of the time, the recorded video lectures provided by
our teachers are not easily understandable, not properly sectioned, and hence it takes a
lot of time to make notes of all crucial points. In order to give the best possible
experience for online lectures, we are offering an excellent solution to such problems
by providing the feature of automatic captioning. It helps students save time, often spent
going through the videos repeatedly to understand the context said by our teachers. This
model is also a very efficient alternative for the individuals who face difficulty in
hearing or are completely deaf. They can simply refer the subtitles instead of struggling
with long procedures which is traditionally followed. Our project promises more
accuracy compared to the existing interfaces as we are working with the latest
technologies and deep learning models. We will cross verify the results with multiple
datasets and will ensure that the results provided to the user are the closest ones. Apart
from this we are also providing our user with the transliteration feature using which
they can overcomes the limitation of language barrier. Hence increasing the reach of
this application and making it user friendly.
This application ensures to provide the most efficient and time-saving method of
learning by providing students with the crux of the whole video lecture in the form of
a summary which will be generated from the generated transcription. By the addition
of this feature there is no need to go through the entire video or audio content to
understand the core concept of the lecture instead the student can simply go through the
summary and can form a basic idea about the main objection and targeted area of that
particular lecture video or audio. Here we are using the latest natural language
processing (NLP) techniques and deep learning techniques to achieve our objective
along with Azure API to speech to text transcription and data storage cloud. Our main
aim is to make drive student’s interest in digitally uploaded lectures and provide them
with the most user-friendly ,accurate and engaging web application where they can
spend hours learning without being bored and irritated. Our interface is the best tool for
exam preparations as we provide our students with question answers related to each
lecture. We understand that going through only the video lectures doesn't provide a
feeling of confidence to the student so we aim to embed this model with the MCQ
generation and question answering applications to make the learning process smooth.
Nowadays students prefer to learn a night before their examination and sometimes this
process gets quite hectic as the student have to search a lot on net in order to get the
proper material for learning and then papers in order to gain confidence about what they
have learnt. But with the help of our model this process won’t be hectic as Before the
examination the students won’t be worried about their notes neither they have to waste
hours on internet searching for online papers and relevant materials. Our website will
provide them a complete guide to get exam ready and be confident about the material
they have gasped a day before their examinations.

## Our Solution

Majorly our entire solution is divided into 3 components:

_Phase 1-Automatic Caption Generation from Audio:_
Automatic caption will be generated by using various machine learning
algorithms and some APIs. In such algorithms, the program is enabled to
process human speech into a written format and focuses on the translation of
speech from a verbal format to a text one. These algorithms are made up of a
few components, such as the speech input, feature extraction, feature vectors,
a decoder, and a word output. The decoder leverages acoustic models, a
pronunciation dictionary, and language models to determine the appropriate
output.

_Phase 2-Summary Generation from captions obtained:_
Every caption obtained is saved in a text file from which summary will be
generated. Text would then be clean from the noise and the output of the
cleaning step is a vocabulary that will be used as input for the summary
generation methods. The model is trained by a deep learning method, which
can identify important words that should be included in the summary.

_Phase 3-Automatic Question and Answer Generation:_
In order to generate automatic question and answer, the system needs to extract answers
from the sentences and then generate questions based on the extracted answer. Finally,
the system will generate answers for each question formed and then compare and
validate the answers.

## Tech Stack

- NodeJS, HTML,CSS,JS
- MongoDB
- Azure Cognitive Services
- BART summarizer and T5 QnA Generation

## Live link

Link: https://bit.ly/qagl-project

### Contributors

- Nakshatra
- Sneha Devrani
- Anirudh Goel
- Prabal Gautam
