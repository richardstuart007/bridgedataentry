//------------------------------------------------------------------------
//  Remote - Production
//------------------------------------------------------------------------
//
//  Remote/Local Client --> Remote Server 1 --> Remote Database 1
//
exports.REM_CLIENT1 = 'LOC/REM:12011'
exports.REM_SERVER1 = 'REMOTE:Render/11011'
exports.REM_DATABASE1 = 'REMOTE:Elephant/21'
exports.REM_SERVERURL1 = 'https://quizserver021render.onrender.com'
//
//  Remote/Local --> Remote Server 2 --> Remote Database 2
//
exports.REM_CLIENT2 = 'LOC/REM:12022'
exports.REM_SERVER2 = 'REMOTE:Render/11022'
exports.REM_DATABASE2 = 'REMOTE:Elephant/21'
exports.REM_SERVERURL2 = 'https://quizserver021render.onrender.com'
//------------------------------------------------------------------------
//  Local
//------------------------------------------------------------------------
//
//  Local Client --> Local Server --> Local Database 6
//
exports.LOC_LOC_LOC_CLIENT6 = 'LOCAL:12606'
exports.LOC_LOC_LOC_SERVER6 = 'LOCAL:11606'
exports.LOC_LOC_LOC_DATABASE6 = 'LOCAL:6'
exports.LOC_LOC_LOC_SERVERURL6 = 'http://localhost:11606'
//
//  Local Client --> Local Server --> Local Database 7
//
exports.LOC_LOC_LOC_CLIENT7 = 'LOCAL:12707'
exports.LOC_LOC_LOC_SERVER7 = 'LOCAL:11707'
exports.LOC_LOC_LOC_DATABASE7 = 'LOCAL:7'
exports.LOC_LOC_LOC_SERVERURL7 = 'http://localhost:11707'
//
//  Local Client --> Local Server 1 --> Remote Database 1
//
exports.LOC_LOC_REM_CLIENT1 = 'LOCAL:12101'
exports.LOC_LOC_REM_SERVER1 = 'LOCAL:11101'
exports.LOC_LOC_REM_SERVERURL1 = 'http://localhost:11101'
//
//  Local Client --> Local Server 2 --> Remote Database 2
//
exports.LOC_LOC_REM_CLIENT2 = 'LOCAL:12202'
exports.LOC_LOC_REM_SERVER2 = 'LOCAL:11202'
exports.LOC_LOC_REM_SERVERURL2 = 'http://localhost:11202'
//------------------------------------------------------------------------
//  Server details
//------------------------------------------------------------------------
exports.URL_TABLES = '/QuizTables'
//------------------------------------------------------------------------
//  Other Parameters
//------------------------------------------------------------------------
exports.SQL_ROWS = 2000
exports.VALIDATE_ON_CHANGE = false
