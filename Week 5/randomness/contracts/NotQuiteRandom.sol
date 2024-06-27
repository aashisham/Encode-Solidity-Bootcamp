// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract NotQuiteRandom {
    function getRandomNumber()
        public
        view
        returns (uint256 notQuiteRandomNumber)
    {
        // TODO: get randomness from block hash
    }

    function tossCoin() public view returns (bool heads) {
        // TODO: make the random number be translated to a boolean
    }
}