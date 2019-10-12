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

let trips = await getTrips().then(data => {
  return data.map(item => {
    item.billedAmount = parseFloat(item.billedAmount.toString().replace(',', ''));
    return item;
  })
})
async function driverReport() {
  // Your code goes here

  
  let getId = trips.reduce((user, cur)=>{
    user[cur.driverID] ? user[cur.driverID] = user[cur.driverID] + 1 : user[cur.driverID] = 1
    return user
  }, {})

  let mapId = Object.keys(getId)
  // console.log(mapId)
  let result = await mapId.reduce(getReport, [])
  // console.log(result)
  return result
  

}

async function getReport(acc, cur){
  

  acc = await acc
  // console.log(acc)
  let user = {}
  let singleTrip = trips.filter(item => item.driverID == cur)
  // console.log(singleTrip)
  if (singleTrip && singleTrip.length){

    return getDriver(cur).then( async data => {
      let { name, phone, vehicleID } = data
      user = {
        fullName: name,
        id: cur,
        phone,
        noOfTrips: singleTrip.length,
        noOfVehicle: vehicleID.length
      }
      let vehiclePromise = Promise.all(vehicleID.map(async item => {
        return await getVehicle(item)
      }))
      let vehicleDetails =  await vehiclePromise
      // console.log(vehicleDetails)
      let vehicle = vehicleDetails.map(item => {
        let details = {
          plate: item.plate,
          manufacturer: item.manufacturer
        }
        return details
      })
      user['vehicles'] = vehicle
      let tripDetails = singleTrip.map(item => {
        let id = item.driverID
        let cash = 0
        let nonCash = 0
        let totalAmountEarned = 0
        let totalCashAmount = 0
        let totalNonCashAmount = 0
        item.isCash ? (cash++ , totalCashAmount += item.billedAmount, totalAmountEarned += item.billedAmount) : (nonCash++ , totalNonCashAmount += item.billedAmount, totalAmountEarned += item.billedAmount)
        let trips = {
          user: item.user.name,
          created: item.created,
          pickup: item.pickup.address,
          destination: item.destination.address,
          billed: totalAmountEarned,
          isCash: item.isCash
        }

        // console.log(trips)
        return { id, cash, nonCash, totalAmountEarned, totalCashAmount, totalNonCashAmount, trips }
      })
      user["noOfCashTrips"] = tripDetails.map(item => item.cash).reduce((user, cur) => { return user + cur }, 0)
      user["noOfNonCashTrips"] = tripDetails.map(item => item.nonCash).reduce((user, cur) => { return user + cur }, 0)
      user["totalAmountEarned"] = tripDetails.map(item => item.totalAmountEarned).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
      user["totalCashAmount"] = tripDetails.map(item => item.totalCashAmount).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
      user["totalNonCashAmount"] = tripDetails.map(item => item.totalNonCashAmount).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
      user['trips'] = []
      user['trips'].push(tripDetails.map(item => item.trips))
      // console.log(user)

      acc.push(user)
      // console.log(acc)
      return acc

    }).catch(err =>{
      console.log(acc)
      if(err){
        user = {
          id: cur,
          noOfTrips: singleTrip.length,
          vehicles: []
        }
        let tripDetails = singleTrip.map(item => {
          let id = item.driverID
          let cash = 0
          let nonCash = 0
          let totalAmountEarned = 0
          let totalCashAmount = 0
          let totalNonCashAmount = 0
          item.isCash ? (cash++ , totalCashAmount += item.billedAmount, totalAmountEarned += item.billedAmount) : (nonCash++ , totalNonCashAmount += item.billedAmount, totalAmountEarned += item.billedAmount)
          let trips = {
            user: item.user.name,
            created: item.created,
            pickup: item.pickup.address,
            destination: item.destination.address,
            billed: totalAmountEarned,
            isCash: item.isCash
          }
          // console.log(trips)
          return { id, cash, nonCash, totalAmountEarned, totalCashAmount, totalNonCashAmount, trips }
        })
        user["noOfCashTrips"] = tripDetails.map(item => item.cash).reduce((user, cur) => { return user + cur }, 0)
        user["noOfNonCashTrips"] = tripDetails.map(item => item.nonCash).reduce((user, cur) => { return user + cur }, 0)
        user["totalAmountEarned"] = tripDetails.map(item => item.totalAmountEarned).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
        user["totalCashAmount"] = tripDetails.map(item => item.totalCashAmount).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
        user["totalNonCashAmount"] = tripDetails.map(item => item.totalNonCashAmount).reduce((user, cur) => { return user + cur }, 0).toFixed(2)
        user['trips'] = []
        user['trips'].push(tripDetails.map(item => item.trips))
     
        console.log ('wait')
      }
      console.log(user)
      acc.push(user)
      return acc

    })
  }

  return acc
}


driverReport().then(data => {console.log(data)})


module.exports = driverReport;
