## Property Registration Network

Case study and implementation of how can we build a solution for 'Property Registration System' using Hyperledger Fabric.

## Origin of Property Registration
Property registration is the process by which you register the documents related to a property of yours with legal entities. For instance, when you purchase a flat directly from a builder, property registration gives you the right to legally own, use or dispose of the property. When you have a legal ownership title over a property, there is a low likelihood of fraud or misappropriation.

## Need for Property Registration
Property registration is required to maintain the ownership of land/property deeds. There are many reasons to get your property registered:
-	Avoid conflicts: Proper property registration helps individuals avoid conflicts arising from land disputes.
-	Maintain ownership: Property registration also helps to identify the rightful owner of a property.
-	Comply with legal processes: Many legal processes require individuals to furnish proper land deeds and documentation.

These requirements make the property registration process an essential part of the legal and financial worlds. A traditional process for property registration already exists, but there are major challenges related to the process. Through this case study, we are going to assess and tackle the challenges of the traditional property registration process. But first, let us look at what the challenges are.

## Problems/Challenges of Property Registration
-	Property registration is a mere record of a sales transaction.
-	There could be multiple parties claiming ownership of the same property.
-	Although property ownership can be challenged in the court, the verification process is cumbersome and time-consuming.
-	Ownership documents could be tampered with.
-	Tampering of land deeds can lead to the wrong individuals acquiring ownership of properties for personal gain. This a major issue in developing countries, and also creates a huge backlog of civil cases in courts.
-	Benami registrations: This is a transaction in which a property is transferred to one person for the consideration paid by another person. This also leads to corruption and tax evasions.

## Solution Blueprint
In the previous segment, you understood the motivation behind building a blockchain solution for the 'Property Registration System'. Now we will discuss the blueprint of the solution. We will discuss the blueprint in the following order:
1.	Stakeholders of the network
2.	Logical flow
3.	Assets on the ledger

## 1. Stakeholders of the Network
There are two stakeholders involved in this case study: Users and Registrar.

1.1. Users are the people who wish to sell/buy the properties registered on this network. They need to be explicitly registered on the network to be able to buy/sell the properties registered on it.

1.2. Let's take a look at Registrar now. In a traditional property registration system, a registrar is the record keeper who facilitates, monitors and validates all property or land transactions. In this problem statement, the registrar has multiple roles. For example, if a user wishes to register himself/herself on the system, then the registrar must validate the identity of the user before adding them to the system. Talking of another use case, suppose a user wishes to register their property on the network. They would first raise a request to the registrar who, in turn, will register the property on the ledger after validation.

## 2. Logical Flow
The entire flow of this case study can be divided into three parts:

**2.1. User Registration**

**2.2. Property Registration**

**2.3. Property Transfer**

We will look into each of these subparts individually.

**2.1. User Registration:** This process comprises of the following steps:

	2.1.1. A user with permission to access the network raises a request to the registrar to store their data/credentials on the ledger.

	2.1.2. The request gets stored on the ledger.

	2.1.3. The registrar reads the request and stores the user's data/credentials on the ledger after validating their identity manually.

	2.1.4. There is a digital currency called 'upgradCoins' associated with each user's account. All transactions on this network can be carried out only with this currency. When a user joins the network, he/she has 0 'upgradCoins'.

**2.2. Property Registration:** This process comprises of the following steps:

	2.2.1. A user added to the property registration system raises a request to the registrar to register their property on the network.

	2.2.2. The request gets stored on the ledger.

	2.2.3. The registrar reads the request and stores the property on the ledger after validating the data present in the request. For example, suppose Mr Garg registers himself on the network and raises a request to register his farmhouse in Lonavala. Now, the registrar needs to verify whether the property is real and whether it actually belongs to Mr Garg, before registering it on the ledger.

Note: In this process, the property gets only registered on the system. It can be purchased by other registered users only if its owner explicitly wishes to list it for sale. You will understand this better as you move ahead with the problem statement.

**2.3 PropertyTransfer:** This process comprises of the following steps:

	2.3.1. The owner of the property must put the property on sale.

	2.3.2. The buyer of the property must ensure that the amount of 'upgradCoins' they have is greater than or equal to the price of the property. If not, then the user must recharge their account.

	2.3.3. If the two criteria above are satisfied, then the ownership of the property changes from the seller to buyer and 'upgradCoins' equal to the price of the property are transferred from the buyer's account to the seller's account.

## 3. Assets on the ledger

	3.1. Users: Each user's data/credentials, such as name, email Id, Aadhar number, etc., need to be captured before they can be allowed to buy/sell properties on the network. The credentials of each user are stored as states on the ledger.

	3.2. Requests: Recall that the users need to raise a request to the registrar in order to register themselves on the network or to buy property on the ledger. These requests get stored on the ledger.

	3.3. Property: Properties owned by users registered on the network are stored as assets on the ledger.

The entire case study can be split into two distinct sections: 
**1. Fabric Network Setup**
**2. Chaincode Development**

We will look into each of these sections individually in the following segments.

**1. Fabric Network Setup**

There are two organisations in the network: 'Users' and 'Registrar'. There are two peers defined for the organisation 'Registrar' and three peers defined for the organisation 'Users'. The buyers/sellers registered on the network will use the peers of the organisation 'Users' to invoke functions to perform tasks such as user/property registration. Similarly, the registrars registered on the network will use the peers of the organisation 'Registrar' to perform functions such as approval of requests for user/property registration, etc.

**2. Chaincode Development**
As part of developing the smart contract for the 'property-registration-network', we need to implement the logic for the following transactions:

Transactions

**requestNewUser**

	Initiator: User
	Output: A 'Request' asset on the ledger
	Use Case: This transaction is called by the user to request the registrar to register them on the property-registration-network.
	Flow:
	-	A user registered on the network initiates a transaction to request the registrar to store their details/credentials on the ledger.

	-	The details include: Name, Email ID, Phone Number, Aadhar Number, CreatedAt

	-	All these details will be stored as a Request state on the ledger in the form of key-value pairs. The Name and Aadhar number of the user, along with an appropriate namespace, should be used to create a composite key for this Request asset on the ledger.

	-	The transaction will return the Request object.

**approveNewUser**

	Initiator: Registrar

	Output: A 'User' asset on the ledger

	Use Case: The registrar initiates a transaction to register a new user on the ledger based on the request received.

	Flow:
	-	This function takes the name and aadhar number of the user who generated the request for registration as input parameters.
	-	The user's Request object is fetched from the ledger. The request contains several details about the user.
	-	These details are then used to create a new User asset on the ledger.
	A new field named 'upgradCoins' will get added as an attribute. 'upgradCoins' is a kind of currency that can be used by each user to purchase property on the asset. 
	For example, if the price of a property is stated as 500 upgradCoins, only a user with 'upgradCoins' equal to or greater than 500 will be able to purchase it. The initial value of this attribute is set to zero. There is a separate function to recharge the account balance which you will see next.

**rechargeAccount**
	Initiator: User

	Use Case: This transaction is initiated by the user to recharge their account with 'upgradCoins'.

	Flow:
	-	This transaction is used by a registered user to recharge their account with 'upgradCoins'. Before initiating the transaction, the user needs to pay the price of the 'upgradCoins' that they wish to purchase; they need to pay this to the network admin. In return, the user will get a Bank Transaction ID, which they need to pass as a parameter at the time of initiating the transaction.
	-	This function takes the Name, Aadhar number and Bank Transaction ID of the user as input.
	If the Bank Transaction ID passed as input to the function is valid, then the data corresponding to the user ID is fetched from the ledger and the 'upgradCoins' attribute is updated.
	Each Bank Transaction ID has some transaction amount associated with it. In an ideal case, this information about the transaction will be provided by the bank involved in the transaction. However, for this case study, we will validate the input Bank Transaction ID against a predefined list of transaction ids.
	Bank Transaction ID - Number of upgradCoins

	upg100–100
	upg500–500
	upg1000–1,000
	For example, if 'upg500' is passed as an input parameter by Mr. Garg, then his account gets recharged with 500 upgradCoins. If a Transaction ID other than that mentioned above is passed, decline the transaction with the message "Invalid Bank Transaction ID".

**viewUser**
	Initiator: User or Registrar
	Use Case: This function should be defined to view the current state of any user.

**propertyRegistrationRequest**
	Initiator: User

	Output: A 'Request' asset on the ledger

	Use Case: This function should be initiated by the user to register the details of their property on the property-registration-network.

	Flow:
	-	A user registered on the property-registration-network raises a request to the registrar to store their property details on the ledger.
	
	The details include the following:

	-	Property ID: Ideally, it should be a string comprising of the geo-coordinates of the property to identify it. However, in this case study, we will be using simple strings such as "001" to identify the property.
	-	Owner: The owner of the property.
	-	Price: The price of the property
	-	Status: Status can take only two values: 'registered' and 'onSale'. When the status of the property is set to 'registered', it is not listed for sale; however, when the status of the property is set to 'onSale', it is put on sale by its owner.
	-	In addition to the above details, Name and Aadhar number of the user should also be passed as input parameters. The 'Owner' attribute should store the composite key of the owner of this property.
	-	The request gets registered on the ledger only after validating if the details of the owner of the property is registered on the property-registration-network.
	-	The transaction will return the Request object.

**approvePropertyRegistration**
	Initiator: Registrar

	Output: A 'Property' asset on the ledger

	Use Case: This function is used by the registrar to create a new 'Property' asset on the network after performing some manual checks on the request received for property registration.

	Flow:
	-	As input, this transaction takes the Property ID of the property for which the request was raised.
	-	The Request asset corresponding to the Property ID is fetched from the ledger. The request contains several details about the property.
	-	These details are then used to create a new Property asset on the ledger. This property is then stored on the ledger in the form of key-value pairs. Property ID along with appropriate namespace is used to create the composite key for this asset.

**viewProperty**

	Initiator: User or Registrar

	Use Case: This function should be defined to view the current state of any property registered on the ledger.

**updateProperty**
	Initiator: A registered user who has their property registered on the ledger.

	Use Case: This function is invoked to change the status of the property.

	Flow:
	-	This function takes Property ID, Name, Aadhar number and Status as input parameters.
	-	First, it is ensured that the user invoking the function is the owner of the property.
	-	The status of the property is then updated.
	-	The updated property is then stored back on the ledger.

**purchaseProperty**
	Initiator: A user registered with the network.

	Use Case: In this transaction, the properties listed for sale can be purchased by a user registered on the network.

	Flow:
	-	As input, the function takes the Property ID of the property listed for sale, name and aadhar number of the buyer.
	-	It checks the status of the property to verify whether the property is listed for sale.
	-	It checks whether the initiator of the transaction has sufficient account balance.
	-	After all the validations, the owner of the property is updated.
	-	An amount equal to the cost of the property gets deducted from the buyer and gets added to its seller.
	-	The status and owner of the Property is then updated. The owner becomes the buyer of the property and the status of the property is changed to 'registered'.

**Important Note:**
The 'regnet' chaincode should contain two separate smart contracts: One for the Users and the other for the Registrar.

All the functions that can be initiated by the registrar, such as 'approvePropertyRegistration', have to be included in the smart contract defined for the registrar.

Similarly, all the functions that can be initiated by the users have to be included in the smart contract defined for the users.

The functions which can be initiated by both registrar and user such as 'viewProperty', have to be put in both the smart contracts.

Content Courtesy - upGrad