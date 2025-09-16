# JBApp - My Job Board App

Hey! This is my homework project for CS421. I built a simple job board website where people can post jobs and search through listings. It was pretty fun to make and I learned a lot about web development.

## 🌐 Live Demo
**[Check out the live website here!](https://ommsadul.github.io/jbapp-hw1/)**


## What it does

So basically, you can:
- Post new job listings with all the details
- Search through jobs using keywords  
- Filter jobs by type (full-time, part-time, etc.)
- Sign up and login (I added this extra feature)
- Apply for jobs if you're logged in
- Everything saves automatically so you don't lose your data

The design is pretty clean with this sage green color scheme that I really like. It works on phones and computers too.

## What I used to build it

- HTML for the basic structure
- CSS for making it look nice and responsive
- JavaScript for all the interactive stuff
- localStorage to save everything 

I tried to keep the code organized and not too messy. There are three main files:

```
hw1-task/
├── index.html    # The main page
├── styles.css    # All the styling
├── script.js     # Where the magic happens
└── README.md     # This file you're reading
```

## How to run it

This is super simple - no complicated setup needed!

1. Just download all the files and make sure they're in the same folder
2. Double-click on `index.html` and it should open in your browser
3. That's it! 

If for some reason that doesn't work, try right-clicking on `index.html` and choosing "Open with" and pick your browser.

## How to use it

### Posting jobs
1. Click the "Post Job" button (you need to sign in first - I added authentication as a bonus feature)
2. Fill out the form - at minimum you need a job title and company name
3. Hit submit and boom, your job shows up in the list

### Searching and filtering
- Type anything in the search box to find jobs by title, company, or keywords
- Use the dropdown to filter by job type
- The job count updates automatically
- Click "Clear Filters" to see everything again

### User accounts (bonus feature I added)
- You can sign up for an account 
- Once logged in, you can post jobs and apply for them
- Your applications are tracked so you can see what you've applied for

## Testing it out

I included some sample jobs so you can see how it works right away. Try searching for "developer" or "intern" to see the filtering in action.

You can test posting jobs too - just make up some fake data and see how it looks.

## Some challenges I ran into

- Getting the responsive design to work on mobile was trickier than I thought
- Making sure the search functionality was smooth took a few tries
- I originally forgot to add the authentication check for posting jobs (oops!)

## What could be better

If I had more time, I'd probably add:
- A real backend database instead of localStorage
- Better job application tracking
- Email notifications maybe?
- File uploads for resumes
- More advanced search options

But for a homework assignment, I think this covers all the requirements and then some!

## Browser stuff

Works fine in Chrome, Firefox, Safari, and Edge. Pretty much any modern browser should be good.



