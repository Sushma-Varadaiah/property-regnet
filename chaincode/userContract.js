"use strict";

const { Contract } = require("fabric-contract-api");

class UserRegnetContract extends Contract {
  constructor() {
    // Custom namespace
    super("org.property-registration-network.userRegnet");
  }

  // Instantiate to verify the chaincode installation
  async instantiate(ctx) {
    console.log("userRegnet Smart Contract Instantiated");
  }

  async requestNewUser(ctx, name, email, phone, aadhar) {
    if (ctx.clientIdentity.getMSPID() == "usersMSP") {
      // Create a new composite key for the new user request
      const userReqKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.request", [
        name,
        aadhar,
      ]);

      // Create a request object to be stored in blockchain
      let newRequestObject = {
        name: name,
        email: email,
        phone: phone,
        aadhar: aadhar,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBuffer = Buffer.from(JSON.stringify(newRequestObject));
      await ctx.stub.putState(userReqKey, dataBuffer);
      // Return value of new user request created
      return newRequestObject;
    } else {
      console.log("Unable to create new request object");
    }
  }

  async viewUser(ctx, name, aadhar) {
    const userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);
    let userBuffer = await ctx.stub.getState(userKey).catch((err) => console.log(err));
    return JSON.parse(userBuffer.toString());
  }

  async rechargeAccount(ctx, name, aadhar, bankTransId) {
    //to check if initiator is a user
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "usersMSP") {
      let userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);

      let updateCheck = false;
      let userBuf = await ctx.stub.getState(userKey).catch((err) => console.log(err));

      const user = JSON.parse(userBuf.toString());
      switch (bankTransId) {
        case "upg100":
          user.upgradCoins = 100;
          updateCheck = true;
          break;
        case "upg500":
          user.upgradCoins = 500;
          updateCheck = true;
          break;
        case "upg1000":
          user.upgradCoins = 1000;
          updateCheck = true;
          break;
        default:
          console.log("Invalid Bank Transaction ID");
      }
      if (updateCheck == true) {
        let dataBuffer = Buffer.from(JSON.stringify(user));
        await ctx.stub.putState(userKey, dataBuffer);
      }
    }
  }

  async propertyRegistrationRequest(ctx, name, aadhar, propertyID, owner, price, status) {
    //to check if the initiator is user
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "usersMSP") {
      let userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);

      let user = await ctx.stub.getState(userKey).catch((err) => console.log(err));

      if (user != null) {
        // Create a user property request object
        let userPropertyReqObject = {
          propertyID: propertyID,
          price: price,
          status: status,
          owner: userKey,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.propertyReq", [
          propertyID,
        ]);

        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(userPropertyReqObject));
        await ctx.stub.putState(propKey, dataBuffer);
        // Return value of new property request object created by user
        return userPropertyReqObject;
      }
    }
  }

  async purchaseProperty(ctx, name, aadhar, propertyID) {
    //to check if the initiator is user
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "usersMSP") {
      let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.property", [propertyID]);

      let propertyBuf = await ctx.stub.getState(propKey).catch((err) => console.log(err));

      const property = JSON.parse(propertyBuf.toString());

      if (property != undefined && property.status == "onSale") {
        let buyerKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);
        let buyerBuf = await ctx.stub.getState(buyerKey).catch((err) => console.log(err));

        const buyer = JSON.parse(buyerBuf.toString());

        let sellerKey = property.owner;
        let sellerBuf = await ctx.stub.getState(sellerKey).catch((err) => console.log(err));

        const seller = JSON.parse(sellerBuf.toString());

        if (buyer != undefined && buyer.upgradCoins > property.price) {
          property.owner = buyerKey;
          buyer.upgradCoins = parseInt(buyer.upgradCoins) - parseInt(property.price);
          seller.upgradCoins = parseInt(seller.upgradCoins) + parseInt(property.price);
          property.status = "registered";
        }

        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer1 = Buffer.from(JSON.stringify(property));
        await ctx.stub.putState(propKey, dataBuffer1);

        let dataBuffer2 = Buffer.from(JSON.stringify(buyer));
        await ctx.stub.putState(buyerKey, dataBuffer2);

        let dataBuffer3 = Buffer.from(JSON.stringify(seller));
        await ctx.stub.putState(sellerKey, dataBuffer3);
      }
    }
  }

  async viewProperty(ctx, propertyID) {
    let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.property", [propertyID]);
    let property = await ctx.stub.getState(propKey).catch((err) => console.log(err));
    return JSON.parse(property.toString());
  }

  async updateProperty(ctx, name, aadhar, propertyID, status) {
    //to check if the initiator is user
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "usersMSP") {
      let userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);
      let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.property", [propertyID]);
      let propertyBuf = await ctx.stub.getState(propKey).catch((err) => console.log(err));

      const property = JSON.parse(propertyBuf.toString());

      if (property != undefined && property.owner == userKey) {
        //to update property status
        property.status = status;
      }

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBuffer = Buffer.from(JSON.stringify(property));
      await ctx.stub.putState(propKey, dataBuffer);
    }
  }
}
module.exports = UserRegnetContract;
