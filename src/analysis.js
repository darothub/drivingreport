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
    let getDriverReport = await getTrips()
    // console.log(getDriverReport)
    let cashNonCash = toFilter(getDriverReport, "isCash")
    let isCash = cashNonCash['isTrue']
    let nonCash = cashNonCash['isFalse']
    let cashBill = parseFloat(sum(isCash, "billedAmount"))
    let nonCashBill = parseFloat(sum(nonCash, "billedAmount"))
    let tota1Bill = parseFloat(sum(getDriverReport, "billedAmount"))
    // console.log(tota1Bill)

    let getId = getDriverReport.reduce(async (user, cur, index, arr) => {
      // console.log(arr)
      user = await user
      let each = arr.filter(item=> item.driverID == cur.driverID )
      // console.log(each[0].driverID)
      if(user.noOfTrips > each.length){
        return user
      }
      let driver = await getDriver(each[0].driverID).then(data => { return data }).catch(err => { return err })
      let {name, email, phone} = driver
      // console.log(driver)
      user={
        name,
        email,
        phone,
        noOfTrips: each.length,
        totalAmountEarned: parseFloat(sum(each, "billedAmount"))
      }
      return user

    }, {})

    let highestEarner = getDriverReport.reduce(async (acc, cur, index, arr)=>{
      acc = await acc
      let each = arr.filter(item => item.driverID == cur.driverID)
      // console.log(each)
      let earning = sum(each, "billedAmount")
      // console.log(earning)
      let driver = await toGetDriver(each[0].driverID)
      // console.log(await driver)
      let { name, email, phone } = driver
      if (acc['totalAmountEarned'] > parseFloat(earning) && name != undefined) {
        return acc
      }

      acc = {
        name,
        email,
        phone,
        noOfTrips: each.length,
        totalAmountEarned: parseFloat(earning)
      }

      return acc
    }, {})

    // console.log(await highestEarner)
    

    let result = {
      noOfCashTrips: isCash.length,
      noOfNonCashTrips: nonCash.length,
      billedTotal: tota1Bill,
      cashBilledTotal: cashBill,
      nonCashBilledTotal: nonCashBill,
      noOfDriversWithMoreThanOneVehicle: 3,
      mostTripsByDriver: await getId,
      highestEarningDriver: await highestEarner,
    }
    return result
  }
  catch(err){
    return err
  }

}

    // console.log(arr)

async function toGetDriver(arr){
  let get = await getDriver(arr).then(data=>{
    return data
  })
.catch(err => {return err})
  return get
}
function sum(a, b) {
  let sum;
  if (b == undefined) {
    sum = a.reduce((acc, cur) => {
      acc = acc + parseFloat(cur)
      return acc
    }, 0)
    return sum
  }
  sum = a.reduce((acc, cur) => {
    acc = acc + parseFloat(cur[b].toString().replace(',', ''))

    return acc
  }, 0)
  sum = sum.toFixed(2)
  return sum
}
function toFilter(a, b){ 
  let  isTrue = a.filter(item => item[b]  == true )
  let isFalse = a.filter(item => item[b] == false)
  return {isTrue, isFalse}
}



analysis().then(data=>{console.log(data)}).catch(err=>{console.log(err)})


module.exports = analysis;
