export default function randomSort(dataIn) {
  //
  //  Load the workArray
  //
  let workArray = []
  dataIn.forEach(data => {
    const ansObj = {
      random: Math.random(),
      details: data
    }
    workArray.push(ansObj)
  })
  //
  //  Sort the workArray
  //
  workArray.sort((a, b) => (a.random > b.random ? 1 : -1))
  //
  //  Strip out the random element
  //
  const dataSorted = workArray.map(data => {
    return data.details
  })
  //
  //  Return sorted array
  //
  return dataSorted
}
