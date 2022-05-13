import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useRef, useState } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from "../constants";

export default function Home() {
  // keep track of connection status for user's wallet
  const [walletConnected, setWalletConnected] = useState(false);
  // keep track of current metamask's whitelist status
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  // loading state
  const [loading, setLoading] = useState(false);
  // number of whitelisted addresses
  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  // create reference to web3 modal to connect to Metamask
  const web3ModalRef = useRef();

  /*
    Return a Provider or Signer object representing Ethereum RPC with or 
    without the signing capabilities of metamask attached.

    Providers read state of blockchain

    Signer is used to write transactions and requires a digital signature to authorize
    transactions being sent. metamask exposes a Signer API to request signatures from
    the user.

    @param{*}needSigner - True if you need the signer, defaults to false
  */

  const getProviderOrSigner = async (needSigner=false) => {
    // connect to metamask
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // user must be connected to Rinkeby network
    // otherwise, through error
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 4) {
      window.alert("Must use Rinkeby network - please change your network.");
      throw new Error("Change network to Rinkeby");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  // add adddress to whitelist
  const addAddressToWhitelist = async () => {
    try {
      // get signer
      const signer = await getProviderOrSigner(true);

      // create new instance of the contract with a signer
      // this allows for update methods
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // add address from contract
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);

      // wait for transaction to be minted
      await tx.wait();
      setLoading(false);

      // get updated number of addresses in whitelist
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (e) {
      console.error(e);
    }
  }

  // get number of whitelisted addresses
  const getNumberOfWhitelisted = async () => {
    try {
      // get provider from web3Modal - metamask
      // don't need a signer, only reading state
      const provider = await getProviderOrSigner();

      // connect to contract using provider
      const whitelistContract = new Contract (
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      // get number of whitelisted addresses from contract
      const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (e) {
        console.error(e);
    }
  };

  // check if address is already whitelisted
  const checkIfAddressInWhitelist = async () => {
    try {
      // get signer now for getting address later
      const signer = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      // get the address of signer - associated with metamask
      const address = await signer.getAddress();

      // get whitelisted addresses from contract
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );
      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
        console.error(e);
    }
  }

  //connect the metamask wallet
  const connectWallet = async () => {
    try {
      // get provider from web3Modal
      await getProviderOrSigner();
      setWalletConnected(true);
  
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (e) {
        console.error(e)
    }
  }

  // render button based on state of dapp
  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for Joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>Join the Whitelist</button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>Connect Your Wallet</button>
      );
    }
  };

  useEffect(() => {
    // try to connect to metamask wallet if not connected
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "rinkeby",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>Whitelist Dapp</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            Its an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            {numberOfWhitelisted} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="./crypto-devs.svg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  );
}

