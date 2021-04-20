For my second Capstone project, I will be creating a diary app called Emotional Chronicles. Emotional Chronicles will allow users to keep track of not only their thoughts on the world over time but also the emotions that those thoughts reveal.

The tech stack for this project will mostly be reinforcing skills learned in our course. Therefore, I will be using Express for the backend and React for the frontend. In addition, I am going to attempt to use Material UI as a React framework for styling.

Both the frontend and backend of this project will be fairly straight forward. The frontend will need to include a calendar for showing when diary entries have been made, diary entries that include the emotional insights, and a form for writing the diary entries. The backend will need to store users’ basic info, diary entries allow with emotional insights, and diary prompt questions. The other things that the backend will need to do are calling the emotional insight API and translating the returned values into user-friendly data.

Emotional Chronicles will be a web app meaning that it will be a progressive web app. This will allow users to use the app at their convenience as you never know when you will have free time or inspiration to write and/or reflect. 

The world can be a very chaotic place at times and it is essential to take time to reflect and examine how we are doing. Toward that goal, Emotional Chronicles will give users those opportunities. By providing users with different writing prompts every day, they will have a chance to sit and reflect on the world while answering the prompt. Once the user has finished writing, their entry will be analyzed for emotional content via “artificial intelligence.” These insights will then be shared with the user.

The emotional analysis will be done using Symanto Research’s Ekman Emotion Analysis API. This returns predictions for anger, disgust, fear, joy, sadness, surprise, and no-emotion with a probability between 0-1. Robert Plutchik’s Wheel of Emotion will then be used as a base for interpreting the returned values. (*NOTE - Two emotions on the wheel, anticipation and trust, are not available which will leave some holes in the model, but users, most likely, will be unaware of this lacking.)  Values less than .5 will be disregarded but will be retained for possible graphing. Values of .5 - .74.will be considered mild/slight, and values of .9 - 1.0 will be considered intense. 

The real trick to this app will be deciding how to display the emotional analyses. Raw numbers and scales are boring. Using the wheel of emotion provides colors connected to those emotions; that will be useful. It’s possible to use a word cloud, but if the writing shows little emotion, this could also be very boring. This needs to be resolved.

Some stretch goals include reminders to users, graphs to display emotional state over time, and the ability to share data.


