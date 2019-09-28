# Source Allies Library App
This project was developed during the 2019 SAI Hackathon.

## Project Authors
* Team Lead
    * Paul Rowe
* UX
    * Edwin O. Martinez Velazquez
* Developers (starring in alphabetical order)
    * Kevin Fode
    * Michael Leners
    * Gene Tinderholm

## User's Guide

### Printing New Labels for New Books
1. Pull down the project.
2. On the command line, run `npm run csv`. This will generate a CSV file in the generated-files directory.
3. Goto https://www.avery.com/software/design-and-print/
4. Click on "Start Designing" and pick the correct label template (we used 5160 for the hackathon)
5. Use the horizontal blank label.
6. On the left side, choose QR codes (it may be hidden. If so, click More...)
7. Click add QR codes
    1. Select spreadsheet
    2. Import the CSV file you generated earlier
    3. The Industry Standard Format should be QR Code
    4. Code Type should be URL
    5. Drag the data over to the website box
    6. Click Finish
8. Resize the QR code so that the black parts of the image are entirely within the "Safety Area"
9. Download the PDF and print it!

### Adding a Book
1. Scan a previously unused QR code with a phone
2. Enter the title, ISBN, and the shelf the book will be located on in the library
3. Click the Submit button

### Checking Out/Checking In a Book
1. Scan the label
2. Click Check In or Check Out

## General Information

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
