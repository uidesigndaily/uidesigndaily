import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import styled from "styled-components";



const StyledButton = styled.button`
  background-color: black;
  font-size: 32px;
  color: white;
`;


type TestProps = {
  macko?: string
}



class App extends Component<TestProps> {

  constructor(props: TestProps) {
    super(props);

  }


  componentDidMount(): void {

    fetch(`/api/v1/sup`)
        .then(response => response.json())
        .then( response => console.log( response ));
  }



  render() {
    return (
        <div className="App">
          <header className="App-header">
            <StyledButton>Testing styled components</StyledButton>

            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>

            is live reload working??
          </header>
        </div>
    );
  }
}

//
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//
//         AAAAA
//       </header>
//     </div>
//   );
// }

export default App;
