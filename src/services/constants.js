//------------------------------------------------------------------------
//  Remote - Server
//------------------------------------------------------------------------
//
//  Remote Server 1 --> Remote Database 1
//
exports.SERVER01 = 'REMOTE:Render/3901'
exports.DATABASE01 = 'REMOTE-1:Elephant'
exports.SERVERURL01 = 'https://bridgeserver01.onrender.com'
//
//  Remote Server 2 --> Remote Database 2
//
exports.SERVER02 = 'REMOTE:Render/3902'
exports.DATABASE02 = 'REMOTE-2:Railway'
exports.SERVERURL02 = 'https://bridgeserver02.onrender.com'
//
//  Remote Server 3 --> Remote Database 3
//
exports.SERVER03 = 'REMOTE:Cyclic/3903'
exports.DATABASE03 = 'REMOTE-3:Elephant'
exports.SERVERURL03 = 'https://bridgeserver03.cyclic.app'
//
//  Remote Server 4 --> Remote Database 4
//
exports.SERVER04 = 'REMOTE:Cyclic/3904'
exports.DATABASE04 = 'REMOTE-4:Railway04'
exports.SERVERURL04 = 'https://bridgeserver04.cyclic.app'
//------------------------------------------------------------------------
//  Local Server
//------------------------------------------------------------------------
//
//  Local Server 1 --> Remote Database 1
//
exports.SERVER11 = 'LOCAL:3911'
exports.SERVERURL11 = 'http://localhost:3911'
//
//  Local Server 2 --> Remote Database 2
//
exports.SERVER12 = 'LOCAL:3912'
exports.SERVERURL12 = 'http://localhost:3912'
//
//  Local Server 3 --> Remote Database 3
//
exports.SERVER13 = 'LOCAL:3913'
exports.SERVERURL13 = 'http://localhost:3913'
//
//  Local Server 4 --> Remote Database 4
//
exports.SERVER14 = 'LOCAL:3914'
exports.SERVERURL14 = 'http://localhost:3914'
//
//  Local Server --> Local Database 6
//
exports.SERVER16 = 'LOCAL:3916'
exports.SERVERURL16 = 'http://localhost:3916'
exports.DATABASE6 = 'LOCAL:bridge6'
//
//  Local Server --> Local Database 7
//
exports.SERVER17 = 'LOCAL:3917'
exports.SERVERURL17 = 'http://localhost:3917'
exports.DATABASE7 = 'LOCAL:bridge7'
//------------------------------------------------------------------------
//  Server details
//------------------------------------------------------------------------
exports.URL_TABLES = '/QuizTables'
exports.URL_HELLO = '/QuizHello'
exports.URL_REGISTER = '/QuizRegister'
//------------------------------------------------------------------------
//  User Defaults
//------------------------------------------------------------------------
exports.DFT_USER_MAXQUESTIONS = 20
exports.DFT_USER_OWNER = 'NZBridge'
exports.DFT_USER_SHOWPROGRESS = true
exports.DFT_USER_SHOWSCORE = true
exports.DFT_USER_SORTQUESTIONS = true
exports.DFT_USER_SKIPCORRECT = true
//------------------------------------------------------------------------
//  Other Parameters
//------------------------------------------------------------------------
exports.SQL_ROWS = 2000
exports.VALIDATE_ON_CHANGE = false
