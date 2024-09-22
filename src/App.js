import "./App.css";
import { useEffect, useState } from "react";
import { Web3 } from "web3";

function App() {
  const [web3, setWeb3] = useState();
  const [accounts, setAccounts] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [contract, setContract] = useState();
  const [newGreeting, setNewGreeting] = useState("");

  useEffect(() => {
    // check if ethereum object exists on window
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const ABI = [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [],
          "name": "getGreeting",
          "outputs": [
            {
              "internalType": "string",
              "name": "",
              "type": "string"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "string",
              "name": "_greeting",
              "type": "string"
            }
          ],
          "name": "setGreeting",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ];

      const contractAddress = "$$$"; // contract address
      const myContract = new web3Instance.eth.Contract(ABI, contractAddress);
      setContract(myContract);
    } else {
      alert("Non-ethereum browser detected. Install Metamask and try again");
    }

    return () => {};
  }, []);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await web3.eth.requestAccounts();
        getGreeting();
        setAccounts(accounts);
      } catch (e) {
        console.error(
          "Error occured while requesting accounts. See details: ",
          e
        );
      }
    }
  };

  const getGreeting = async () => {
    // call function to get greeting
    if (contract) {
      const txReceipt = await contract.methods.getGreeting().call();
      setGreeting(txReceipt);
    }
  };

  const sendGreetingTransaction = async () => {
    if (contract) {
      const txReceipt = await contract.methods.setGreeting(newGreeting).send({
        from: accounts[0],
      });

      setNewGreeting("");
      getGreeting();
      console.log(txReceipt);
    }
  };

  return (
    <div className="App">
      {accounts.length > 0 && (
        <div className="right">
          <p className="info text-right">
            Successfully connected to Metamask wallet
          </p>
          <div className="card">
            <h3>Acccount Details</h3>
            <h5>Address: {accounts[0].slice(0, 14)}...</h5>
          </div>
        </div>
      )}
      <div className="main">
        <h1 className="text-center">My Dapp</h1>
        <div className="content">
          {accounts.length > 0 && (
            <>
              <h5>Current greeting: </h5>
              <h2>{greeting}</h2>
              <h5>Feel free to set new greeting</h5>
              <input
                type="text"
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.target.value)}
              />
              <br />
              <button className="button" onClick={sendGreetingTransaction}>
                Set Greeting
              </button>
            </>
          )}
          {accounts.length === 0 && (
            <button className="button-large" onClick={connectWallet}>
              Connect to MetaMask Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;