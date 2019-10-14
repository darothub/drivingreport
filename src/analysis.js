const { getTrips } = require('api');
const { getDriver } = require('api')
const  { driverReport }  = require('api')

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  try{
    let driver = getTrips()
    let getAnalysis = driverReport()
  

    const result = await Promise.all([getAnalysis, driver])
    console.log(result)
  }
  catch(err){
    return err
  }

}

      // noOfCashTrips: 26,
      // noOfNonCashTrips: 24,
      // billedTotal: 128224.69,
      // cashBilledTotal: 69043.8,
      // nonCashBilledTotal: 59180.89,
      // noOfDriversWithMoreThanOneVehicle: 3,
      // mostTripsByDriver: {
      //   name: 'Bush Gibbs',
      //   email: 'bushgibbs@example.com',
      //   phone: '+234 808-204-2520',
      //   noOfTrips: 7,
      //   totalAmountEarned: 17656.46

analysis().then(data=>{console.log(data)})


module.exports = analysis;
