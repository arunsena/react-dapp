import './App.css';

// Web 3.0 imports
import { useState} from 'react';
import { ethers} from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';


const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

function App() {

  const [greeting, setGreetingValue] = useState('');

  async function requestAccount(){
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function fetchGreeting(){
    if(typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider);
      try{
        const data = await contract.greet();
        console.log({data});
      }
      catch(error){
        console.log({error})
      }
    }
  }

   async function setGreeting(){
    if(!greeting) return
    if(typeof window.ethereum !== 'undefined'){
      await requestAccount();
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract  = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');

      await transaction.wait();
      
      fetchGreeting();
    }
  }
  
  return (
    <div className="App">
      <button onClick={fetchGreeting}>Fetch Greeetings</button>
      <button onClick={setGreeting}>Set Greeetings</button> 
      <div>
        <input 
        type="text" 
        value={greeting}
        onChange={e => setGreetingValue(e.target.value)}/>
      </div>
    </div>
  );
}

export default App;
