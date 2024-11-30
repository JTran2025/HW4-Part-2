# HW4 Part 2

## Contact
Name: Julian Tran
Email: Julian_Tran@student.uml.edu
COMP 4610 GUI I

https://jtran2025.github.io/HW4-Part-2/multtable.html
https://github.com/JTran2025/HW4-Part-2

## Description
This project uses the jQuery User Interface (UI) library to incorporate sliders and the tabbed interface into the multiplication table generator. Manipulating the sliders changes the value of the textbox and vice versa and dynamically changes the generated table. A new tab is created when pressing the generate button.

## Features
In the HTML file, I used the div element to create each of the slider for each of the maximum and minimum values of the rows and columns. I created a delete button and used the div element to dedicate space for future tabs.

In the CSS file, I changed the width of the sliders, styled the delete button to be different from the generate button, and styled the tabs. For example I made the tabs scrollable, have the background be blue, and had the checkboxes to delete the be on the left of the tabs.

In the JavaScript file, I initialize the sliders using the slider function. I made a function where when the slider is changing, the value inside the textbox changes along with it. Additionally, there is a function to create tabs that appends one after another when generating a new table. I made the table generate inside the newly created tab. I made a function to update the table to coincide the values of the sliders and textbox values in order to create a dynamic table. The title of the tabs changes when the values of the table changes as well. Finally, there is a function that allows the user to select individual or multiple tabs with a checkbox and delete them.

## Issues
I had a couple of bugs where after deleting all of the tabs, the very next tab to be generated does not show a table unless the slider or textbox values are manipulated. Also, sometimes, the value of an unselected tab will change along with the selected tab.

## Acknowledgements
Dr. Wenjin Zhou
Zuriel Pagan
