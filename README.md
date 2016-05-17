# Neighborhood Map Project
## Description
This is a single page app that suggest users 10 pizza places arround Mountain View, CA.
It uses the Foursquare API to get 10 interesting pizza places around Mountain View and display their names in a sidebar and corresponding map markers on a map.
User can filter the pizza places by typing into the search box.
To get the places info, user can click on the place name from the sidebar list, the corresponding map marker will open an infowindow with the place info and a link to it's foursquare review page.
Here is a link to the <a href="http://destino92.github.io/FEND-P6-1-Neighborhood-Map/" target="_blank">live APP</a>

## Motivation
This project is part of **UDACITY** Front End Developer Nanodegree.
I was asked to build this app after completing courses on **JAVASCRIPT DESIGN PATTERN** and **INTRO TO AJAX**.

## Installation
In order to install this project and test locally you will have to run the following command.
```
git clone https://github.com/destino92/FEND-P6-1-Neighborhood-Map.git
cd FEND-P6-1-Neighborhood-Map
npm init
```
And you can open index.html in your browser.
If you are going to play arround with the code do it in the `src` directory, you can run
```
gulp 
```
It will run the default gulp task that you can look up in `gulpfile.js`
To update any changes that you make in the `src` directory to the `dist` directory and reload the page in your web browser.

## Reference
* KnockoutJS
* http://opensoul.org/2011/06/23/live-search-with-knockoutjs/
* Foursquare API documentation
* Google map API documentation

## License
The content of this repository is licensed under this <a href="http://choosealicense.com/licenses/mit/" target="_blank">LICENSE</a>
