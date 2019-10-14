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
  let mapId = trip.map(item => item.driverID )
  // console.log(mapId)

  // let mapId = Object.keys(getId)
  // console.log(mapId)

  let eachTripSummary = mapId.reduce((acc, cur) => {
    let singleTrip = trip.filter(item => item.driverID == cur)
    acc.push(singleTrip)
    return acc
  }, [])
  // eachTripSummary = eachTripSummary[0]
  // console.log(eachTripSummary)

  // console.log(trip)
  let reducedReport = eachTripSummary.reduce(async(acc, cur) =>{
    
    acc = await acc
    // console.log(acc)
    let user = {}
    let singleTrip = trip.filter(item => item.driverID == cur[0].driverID)
    // console.log(singleTrip.length)
    let cash = cur.filter(item => item.isCash == true)
    // console.log(cash.length)
    let nonCash = cur.filter(item => item.isCash == false)

    let driverSummary = await getDriverSummary(cur[0]['driverID'])
    let trips = []
    let customer = {}
    // console.log(cur[0]['pickup'])
    cur[0].user ? (customer['user'] = cur[0]['user']['name'], customer['created'] = cur[0]['created'], customer['pickup'] = cur[0]['pickup']['address'],
      customer['destination'] = cur[0]['destination']['address'], customer['billed'] = cur[0]['billedAmount'], customer['isCash'] = cur[0]['isCash']) : false
      // console.log(customer)
    trips.push(customer)

    let vehicles = []
    if(driverSummary == undefined){
      // console.log(cur)
      user = {
        id: cur[0]['driverID'],
        vehicles: vehicles,
        noOfCashTrips: cash.length,
        noOfNonCashTrips: nonCash.length,
        noOfTrips: cur.length,
        trips: JSON.stringify(trips)
      }
      acc.push(user)
      // console.log(user)
      return acc
    }
    let driverInfo = driverSummary[0]
    let vehicleInfo = driverSummary[1]
    let { name, phone } = driverInfo
    let { plate, manufacturer } = vehicleInfo[0]
    // console.log(plate)
    let vpm = {
      plate,
      manufacturer
    }
    vehicles.push(vpm)
      // console.log(cash.length)
      user ={
        fulName: name,
        phone,
        id: cur[0]['driverID'],
        vehicles: vehicles,
        noOfCashTrips: cash.length,
        noOfNonCashTrips: nonCash.length,
        noOfTrips: cur.length, 
        trips: trips
      }
    
      acc.push(user)
      // console.log(acc)

    return acc
  }, [])
  // reducedReport.then(data =>{console.log(data)})
  return reducedReport

}

async function getDriverSummary(param) {

  let driverDetails = await getDriver(param)
  .then(data => {return data}).catch(err => {return err})
  // console.log(driverDetails)
  let vehicleDetails;
  let { vehicleID } = driverDetails
  if(driverDetails != "Error" & vehicleID != undefined){
    
    // console.log(vehicleID)
    vehicleDetails = vehicleID.map(async item => {
      let vehicleSummary = getVehicle(item)
      return vehicleSummary
    })
    // console.log(await vehicleDetails)
    
    return await Promise.all([driverDetails, vehicleDetails])

  }
}


driverReport().then(data => {
  console.log(data)
})




module.exports = driverReport;
