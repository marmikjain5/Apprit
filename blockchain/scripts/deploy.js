const hre = require("hardhat");

async function main() {
  console.log("Deploying DocumentApproval contract...");

  const DocumentApproval = await hre.ethers.getContractFactory("DocumentApproval");
  const contract = await DocumentApproval.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`DocumentApproval deployed to: ${address}`);
  console.log("Save this address in your Spring Boot application.properties (blockchain.contract.address)");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
