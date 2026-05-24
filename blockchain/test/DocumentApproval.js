const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentApproval", function () {
  let DocumentApproval;
  let contract;
  let owner;
  let approver;

  beforeEach(async function () {
    [owner, approver] = await ethers.getSigners();
    DocumentApproval = await ethers.getContractFactory("DocumentApproval");
    contract = await DocumentApproval.deploy();
  });

  it("Should store a document hash correctly", async function () {
    const docId = "doc123";
    const hash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
    const uploaderId = 101;

    await expect(contract.storeDocumentHash(docId, hash, uploaderId))
      .to.emit(contract, "DocumentStored")
      .withArgs(docId, hash, uploaderId);

    const isVerified = await contract.verifyDocumentHash(docId, hash);
    expect(isVerified).to.be.true;
  });

  it("Should record an approval correctly", async function () {
    const docId = "doc123";
    const hash = "e3b0...";
    
    await contract.storeDocumentHash(docId, hash, 101);

    await expect(contract.connect(approver).recordApproval(docId, "APPROVED"))
      .to.emit(contract, "ApprovalRecorded")
      .withArgs(docId, approver.address, "APPROVED");

    const history = await contract.getApprovalHistory(docId);
    expect(history.length).to.equal(1);
    expect(history[0].approverAddress).to.equal(approver.address);
    expect(history[0].action).to.equal("APPROVED");
  });
});
