// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Donation {
    address public owner;
    uint256 public totalDonations;

    struct DonationRecord {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string donorName;
    }

    DonationRecord[] public donations;

    event Donated(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string donorName
    );

    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function donate(string memory _donorName) public payable {
        require(msg.value > 0, "Donation must be greater than 0");

        donations.push(DonationRecord({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            donorName: _donorName
        }));

        totalDonations += msg.value;

        emit Donated(msg.sender, msg.value, block.timestamp, _donorName);
    }

    function getDonationsCount() public view returns (uint256) {
        return donations.length;
    }

    function getDonation(uint256 index)
        public
        view
        returns (
            address donor,
            uint256 amount,
            uint256 timestamp,
            string memory donorName
        )
    {
        require(index < donations.length, "Invalid index");

        DonationRecord memory d = donations[index];
        return (d.donor, d.amount, d.timestamp, d.donorName);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available");

        payable(owner).transfer(balance);

        emit Withdrawn(owner, balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}