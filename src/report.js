const { getTrips } = require('api');
const { getDriver } = require('api')
const { getVehicle } = require('api')

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */

async function driverReport() {
  // Your code goes here
  let trip = await getTrips()
  trip = trip.map(item => {
    item.billedAmount = parseFloat(item.billedAmount.toString().replace(',', '')).toFixed(2);
    return item;
  })
  let mapId = [... new Set(trip.map(item => item.driverID ))]
  // console.log(mapId)
  let reduceReport = mapId.reduce((acc, cur)=>{
    let singleTrip = trip.filter(item => item.driverID == cur )
    acc.push(singleTrip)
    return acc
  }, [])  

  let reducedTripReport = reduceReport.reduce((acc, cur, index, arr) =>{
    // console.log(cur)
    let driver = {}
    let singleTrip = cur[0]
  //  console.log(cur)
    let cash = cur.filter(item => item.isCash ==true )
    let nonCash = cur.filter(item => item.isCash == false)
    // console.log(nonCash)
    let totalCashAmountByDriver= sum(cash, "billedAmount")
    let totalNonCashAmountByDriver = sum(nonCash, "billedAmount")
    let totalAmountEarnedByDriver = sum(cur, 'billedAmount')
    // console.log(totalNonCashAmountByDriver)
    // console.log(totalAmountEarnedByDriver)
      
    let users = cur.map(item => {
      // console.log(item)
      return {
        "user": item.user.name,
        "created": item.created,
        "pickup": item.pickup.address,
        "destination": item.destination.address,
        "billed": item.billedAmount,
        "isCash": item.isCash
      }
    })
 
    
    driver ={
     id: singleTrip.driverID,
      noOfCashTrips: cash.length,
      noOfNonCashTrips: nonCash.length,
      noOfTrips: cur.length,
      trips: users,
      totalAmountEarned: totalAmountEarnedByDriver,
      totalCashAmount: totalCashAmountByDriver,
      totalNonCashAmount: totalNonCashAmountByDriver  
    }
    // console.log(driver)
    acc.push(driver)
      // console.log(acc)
    return acc
  }, [])
  // console.log(reducedTripReport)
  // return reducedTripReport
  let finalReport = reducedTripReport.reduce(async (acc, cur) => {
    acc = await acc
    let driver = {}

    let driverSummary = getDriverSummary(cur['id']).then(data=> {return data}).catch(err =>{return err})
    let driverPromise =  await driverSummary
    // console.log(driverPromise)

      if(driverPromise == undefined){
        // console.log(cur)
        acc.push(cur)
        return acc
      }
      // console.log(Array.isArray(cur))
      
        let { name, phone } = driverPromise[0]
        let { plate, manufacturer } = driverPromise[1]
        driver = {
          fullName: name,
          phone,
          id: cur['id'],
          vehicles: [{
            plate,
            manufacturer
          }],
          noOfTrips: cur.noOfTrips,
          noOfCashTrips: cur.noOfCashTrips,
          noOfNonCashTrips: cur.noOfNonCashTrips,
          trips: cur.trips,
          totalAmountEarned: cur.totalAmountEarned,
          totalCashAmount: cur.totalCashAmount,
          totalNonCashAmount: cur.totalNonCashAmount  
        }


    // console.log(driver)
    acc.push(driver)

    return acc
  }, [])
  // finalReport = await finalReport
  return finalReport
}

async function getDriverSummary(param) {

  let driverDetails = await getDriver(param)
  .then(data => {return data}).catch(err => {return err})
  // console.log(driverDetails)
  let vehicleDetails;
  let { vehicleID } = driverDetails
  if(driverDetails != "Error" & vehicleID != undefined){
    
    // console.log(vehicleID)
    vehicleDetails = await Promise.all(vehicleID.map(async item => {
      let vehicleSummary = getVehicle(item)
      return vehicleSummary
    }))
    // console.log(await vehicleDetails)
    
    return  Promise.all([driverDetails, ...vehicleDetails])

  }
}

function sum(a, b) {
  let sum;
  if(b == undefined){
    sum = a.reduce((acc, cur) => {
      acc = acc + parseFloat(cur)
      return acc
    }, 0)
    return sum
  }
  sum = a.reduce((acc, cur) => {
    acc = acc + parseFloat(cur[b])

    return acc
  }, 0)
  sum = sum.toFixed(2)
  return sum
}



driverReport().then(data => {console.log(data)})





module.exports = driverReport;
