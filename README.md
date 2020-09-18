# Delta-UI

Delta is a fun word game where, given two four letter words, you try and change one into the other by changing one letter at a time. The catch is that every time you change a letter, the resulting word must be still a valid four letter word. This repo contains the UI portion of the site.

Delta UI is built using React and Redux, and is deployed via AWS S3 and CloudFront. 

## Want to view this UI (locally)?
Simply:
- `git clone` this repo!
- Open with your favourite IDE
- Run `npm i` in your terminal, inside the cloned `delta-ui` folder, this will install all the dependencies!
- Then run `npm start`, this will start Delta-UI in a browser window, at localhost:8080. 
- To start the mock-api, simply navigate to the `package.json` within the mock-api folder, and then run `npm run dev` (again, in your terminal)!

If any of these steps are confusing to you, no worries! No judgement here, please reach out, I would be more than happy to help out. 

NOTE: The api is now implemented via AWS Gateway and Lambda functions so delta-api is out of date. I do plan on releasing the updated code for that but I haven't yet. Regardless, the mock-api should be good enough to get this running locally! 

## Find an issue?
Thank you for using this! If you've found a bug, please [create a ticket](https://github.com/chinanwu/delta-ui/issues)! Or, if you've found a bug and you've fixed it, please [create a merge request](https://github.com/chinanwu/delta-ui/pulls)!

## Potential Future Features:
- Scoring
- Dictionary for words seen during game at the end of game
- Wildcard ability - Turns one of the letters into a "blank" card basically. Allows you to essentially change 2 letters
    - e.g. bank -> book. Use wildcard ability on the "a", so it becomes b*nk -> book, where * can = o. Then we can go straight from bank -> book.
- Versus mode!

## General Improvements
- Accessibility
- Tests (lol)
- Lazy loading/Code splitting [Read](https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/) [Read](https://reactjs.org/docs/code-splitting.html)
- Loading screen/modal/toast?, error modal/toast
- eslint it up!
- Better deployment pipeline
- Words to be added: "poop", "bing"
- Do mobile breakpoints for horizontal views

## General Helpful Tools I used:
- [Colour contrast checker](https://webaim.org/resources/contrastchecker/)
- [Gradient maker](https://mycolor.space/gradient): For the making of the toggle tool's beautiful night sky gradients

## Salmon Read These
I tend to research a lot and read through articles and then add them as a comment in my code but then I forget where I put it so I end up re-researching for an article that said one particular thing over and over. This section is really just for me.
- HOC [1](https://medium.com/@soorajchandran/introduction-to-higher-order-components-hoc-in-react-383c9343a3aa) [2](https://medium.com/@rossbulat/how-to-use-react-higher-order-components-c0be6821eb6c)
- Redux, and some readings about using it to fetch [1](https://medium.com/@stowball/a-dummys-guide-to-redux-and-thunk-in-react-d8904a7005d3) [2](https://medium.com/@kylpo/redux-best-practices-eef55a20cc72) [3](https://redux.js.org/recipes/structuring-reducers/initializing-state/) [4](https://redux-actions.js.org/api/handleaction)
- Toasts [1](https://medium.com/@sheribyrnehaber/designing-toast-messages-for-accessibility-fb610ac364be)
