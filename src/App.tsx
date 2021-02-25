import React from 'react';
import logo from './logo.svg';
import './App.css';
import { ethers } from 'ethers'

// @ts-ignore
declare global {
  // tslint:disable-next-line
  interface Window {
    ethereum: any
  }
}

function App() {
  async function signWithMetamask() {
    try {

      // Modern dapp browsers...
      if (window.ethereum) {
        // Request account access if needed
        await window.ethereum.send("eth_requestAccounts");
        // Acccounts now exposed
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        requestSignature(provider);
      }
      else {
        throw Error("Non-Ethereum browser detected. Please, install MetaMask");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function requestSignature(provider: ethers.providers.Web3Provider) {
    const chainId = (await provider.getNetwork()).chainId;

    const version = "1";
    const providerName = "Hermez Network";
    const contract = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Ganache
    const signer = await provider.getSigner(0);
    const authMessage = "Account creation";
    const babyjub = "0x22870c1bcc451396202d62f566026eab8e438c6c91decf8ddf63a6c162619b52"

    const domain = {
      name: providerName,
      version: version,
      chainId: chainId,
      verifyingContract: contract
    };

    const types = {
      Authorise: [
        { name: "Provider", type: "string" },
        { name: "Autorisation", type: "string" },
        { name: "BJJKey", type: "bytes32" }
      ]
    };
    const value = {
      Provider: providerName,
      Autorisation: authMessage,
      BJJKey: babyjub
    };

    const rawSignature = await signer._signTypedData(domain, types, value)
    const signature = ethers.utils.splitSignature(rawSignature)
    const recoveredAddressTyped = ethers.utils.verifyTypedData(domain, types, value, rawSignature);
    console.log(rawSignature)
    console.log(signature)
    console.log(recoveredAddressTyped)
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <button onClick={signWithMetamask}>
          Sign
          </button>
      </header>
    </div>
  );
}

export default App;
