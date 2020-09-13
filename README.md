# Delta-UI

## Upcoming features:
- Scoring
- Dictionary for words seen during game at the end of game
- Wildcard ability - Turns one of the letters into a "blank" card basically. Allows you to essentially change 2 letters
    - e.g. bank -> book. Use wildcard ability on the "a", so it becomes b*nk -> book, where * can = o. Then we can go straight from bank -> book.
- Versus mode!

## Want to view this UI?
Simply:
- `git clone` this repo!
- Open with your favourite IDE
- Run `npm i`, this will install all the dependencies!
- Then run `npm start`, this will start Delta-UI in a browser window
- To start the mock-api, simply navigate to the `package.json` within the mock-api folder, and then `npm run dev`! 

NOTE: The api is now implemented via AWS Gateway and Lambda functons so delta-api is out of date. But the mock-api should be good enough to get this locally running! 

### General Improvements
- Accessibility
- Tests (lol)
- Lazy loading/Code splitting [Read](https://blog.logrocket.com/lazy-loading-components-in-react-16-6-6cea535c0b52/) [Read](https://reactjs.org/docs/code-splitting.html)
- Loading screen/modal/toast?, error modal/toast
- Pull out general code - Modal, Game
- Better solution for loading - Right now is just a state that is set in every component
- Add bing to word list
- eslint it up!

### Salmon Read These
I tend to research a lot and read through articles and then add them as a comment in my code but then I forget where I put it so I end up re-researching for an article that said one particular thing over and over. This section is really just for me.
- HOC [1](https://medium.com/@soorajchandran/introduction-to-higher-order-components-hoc-in-react-383c9343a3aa) [2](https://medium.com/@rossbulat/how-to-use-react-higher-order-components-c0be6821eb6c)

### General Helpful Tools I used:
- [Colour contrast checker](https://webaim.org/resources/contrastchecker/)
- [Gradient maker](https://mycolor.space/gradient): For the making of the toggle tool's beautiful night sky gradients
