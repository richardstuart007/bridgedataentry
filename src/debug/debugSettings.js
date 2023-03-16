export default function debugSettings(debug = false) {
  //
  //  Log1 Override, then return DEBUG_LOG value ?
  //
  const { DEBUG_LOG_OVERRIDE } = require('./debugConstants.js')
  const { DEBUG_LOG } = require('./debugConstants.js')
  if (DEBUG_LOG_OVERRIDE) return DEBUG_LOG
  //
  // No Override - return incomming parameter (or default of false)
  //
  return debug
}
