//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist {
  // Max number of whitelisted addresses allowed
  uint8 public maxWhitelistedAddresses;

  // create mapping of whitelistedAddresses
  // if address is whitelisted, set to true
  // false by default
  mapping(address => bool) public whitelistedAddresses;

  // use numAddressesWhitelisted to track how many addresses
  // are whitelisted
  uint8 public numAddressesWhitelisted;

  // set the max number of whitelisted addresses
  // defined at the time the user deploys
  constructor(uint8 _maxWhitelistedAddresses) {
    maxWhitelistedAddresses = _maxWhitelistedAddresses;
  }

  // add address of the sender to whitelist
  function addAddressToWhitelist() public {
    // check if user is already whitelisted
    require(!whitelistedAddresses[msg.sender], "Sender is already whitelisted.");

    // check if available spaces left in whitelist
    require(numAddressesWhitelisted < maxWhitelistedAddresses, "Max number of whitelisted addresses reached.");

    // add address to the whitelisted array
    whitelistedAddresses[msg.sender] = true;

    // increase total number of whitelisted addresses
    numAddressesWhitelisted += 1;
  }

}
