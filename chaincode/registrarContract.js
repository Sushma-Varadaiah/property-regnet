"use strict";

const { Contract } = require("fabric-contract-api");

class RegistrarRegnetContract extends Contract {
  constructor() {
    // Provide a custom name to refer to this smart contract
    super("org.property-registration-network.registrarRegnet");
  }

  /* ****** All custom functions are defined below ***** */

  // This is a basic user defined function used at the time of instantiating the smart contract
  // to print the success message on console
  async instantiate(ctx) {
    console.log("registrarRegnet Smart Contract Instantiated");
  }

  /**
   * To approve new user on the network based on the request received
   * @param ctx - The transaction context
   * @param name - name of the user
   * @param aadhar - aadhar of the user
   * @returns user asset
   */
  async approveNewUser(ctx, name, aadhar) {
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "registrarMSP") {
      // Create the composite key required to fetch record from blockchain
      const requestKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.request", [
        name,
        aadhar,
      ]);

      // Return request object from blockchain
      let reqObj = await ctx.stub.getState(requestKey).catch((err) => console.log(err));

      // Convert the buffer to json object
      const req = JSON.parse(reqObj.toString());

      let newUserObject = {
        name: req.name,
        email: req.email,
        phone: req.phone,
        aadhar: req.aadhar,
        upgradCoins: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBuffer = Buffer.from(JSON.stringify(newUserObject));
      await ctx.stub.putState(userKey, dataBuffer);
      // Return value of new user account created
      return newUserObject;
    } else {
      console.log("transaction aborted");
    }
  }

  /**
   * function to view the current state of any user
   * @param ctx
   * @param name
   * @param aadhar
   * @returns user object
   */
  async viewUser(ctx, name, aadhar) {
    const userKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.user", [name, aadhar]);

    // Return value of user account from blockchain
    let userBuffer = await ctx.stub.getState(userKey).catch((err) => console.log(err));
    return JSON.parse(userBuffer.toString());
  }

  /**
   * To approve user propery details on the network.
   * @param ctx
   * @param propertyID
   * @returns
   */

  async approvePropertyRegistration(ctx, propertyID) {
    let initiator = ctx.clientIdentity.getMSPID();
    if (initiator == "registrarMSP") {
      let propReqKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.propertyReq", [
        propertyID,
      ]);

      let propReqBuf = await ctx.stub.getState(propReqKey).catch((err) => console.log(err));

      const propReq = JSON.parse(propReqBuf.toString());
      if (propReq != undefined) {
        // Create a user property request object
        let propertyObject = {
          propertyID: propReq.propertyID,
          price: propReq.price,
          status: propReq.status,
          owner: propReq.owner,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.property", [
          propertyID,
        ]);

        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(propertyObject));
        await ctx.stub.putState(propKey, dataBuffer);
        // Return value of new property asset created
        return propertyObject;
      }
    } else {
      console.log("Unable to approve property registration");
    }
  }
  /**
   * Function to view a propery .
   * @param ctx
   * @param propertyID
   * @returns
   */

  async viewProperty(ctx, propertyID) {
    let propKey = ctx.stub.createCompositeKey("org.property-registration-network.userRegnet.property", [propertyID]);
    let property = await ctx.stub.getState(propKey).catch((err) => console.log(err));
    return JSON.parse(property.toString());
  }
}
module.exports = RegistrarRegnetContract;
