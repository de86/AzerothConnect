function AzerothConnect(config) {
  // Config object passed at time of creation
  this.appNameSelector = config.appNameSelector;
  this.azerothBaseUrl = config.azerothBaseUrl;
  this.strataAuditPath = config.strataAuditPath;
  this.timestampSelector = config.timestampSelector;
  this.UUIDselector = config.UUIDselector;
  
  // Duration of time to search the Live audit DB. should be kept low.
  this.DURATION = 3;

  // Array of args required to be passed to Azeroth in the generated URL.
  // Args passed to geAzerothURL() must correspond to this array.
  this.URLARGS = ["app", "uuid", "date", "hh", "mm", "ss", "duration"];

  this.injectStyles();
}

/**
 * Gathers relevant information from the clicked UUID and opens a new
 * window to Azeroth. This allows us to view the live XML for the 
 * specific live error we are looking at.
 */
AzerothConnect.prototype.query = function (event) {
  var clickedUUID = event.target
  var uuid = clickedUUID.innerHTML;
  var appName = $(clickedUUID).closest("tbody").find(this.appNameSelector).first().html();
  var timestamp = $(clickedUUID).closest("tbody").find(this.timestampSelector).first().html();
  var dateAsArray = timestamp.split(/[\s,]+/);

  // [0] = HH, [1] = MM, [2] = SS, [3] = SSV (milliseconds to three decimal points)
  var timeAsArray = dateAsArray.splice(3, 1)[0].split(/:|\./);

  var date = this.getDate(dateAsArray);

  var azerothQueryUrl = this.getAzerothUrl([appName, uuid, date, timeAsArray[0], timeAsArray[1], timeAsArray[2], this.DURATION]);

  window.open(azerothQueryUrl, '_blank');
};


/**
 * Injects the CSS that styles the UUIDs as a link
 */
AzerothConnect.prototype.injectStyles = function () {
  var headCss = '<style id="azeroth-connect">\
    ' + this.UUIDselector + '{\
      color: #33d;\
      text-decoration: underline; }\
    ' + this.UUIDselector + ':hover {\
      cursor: pointer;\
      color: #119; }\
    ' + this.UUIDselector + ':active {\
      color: #55f; }';

  $('head').append(headCss);
};


/**
 * Given an array of values this returns a string of arguments to be passed in
 * the Azeroth URL. Arg values must correspond to the azerothURLArgs config array
 */
AzerothConnect.prototype.getArgsString = function (urlArgValues) {
  var argsAsString = "?";
  var numOfArgs = this.URLARGS.length;

    this.URLARGS.forEach(function(arg, i) {
      argsAsString += arg +"=" + urlArgValues[i];

      if ( i < (numOfArgs -1) ) {
        argsAsString += "&";
      };
    });

    return argsAsString;
};


/**
 * Returns the full query URL as a string given an array of arg values.
 * Arg values must correspond to the azerothURLArgs array
 */
AzerothConnect.prototype.getAzerothUrl = function (azerothUrlArgs) {
  var azerothUrlArgsAsString = this.getArgsString(azerothUrlArgs);
  return this.azerothBaseUrl + this.strataAuditPath + azerothUrlArgsAsString;
};


/**
 * Returns the given date as a string in the format of "YYYY-MM-DD"
 */
AzerothConnect.prototype.getDate = function (dateAsArray) {
  var month = this.getMonthFromString(dateAsArray[0]);
  var day = this.getDayFromString(dateAsArray[1]);
  var year = dateAsArray[2];

  return year + "-" + month + "-" + day;
};


/**
 * Returns the Month number given a month name
 */
AzerothConnect.prototype.getMonthFromString = function (monthName) {
  // Arbitrary day and year used as we are only interested in the Month
  var monthNumber = new Date(Date.parse(monthName +" 1, 2000")).getMonth() + 1;
  return this.zeroPad(monthNumber);
};


/**
 * Returns the day number given a day date string with a number suffix 
 * eg. 1st returns 01
 */
AzerothConnect.prototype.getDayFromString = function (day) {
  // Remove suffix from dates day number as Azeroth needs a clean number 
  var dayNum = day.replace(/(st)+|(nd)+|(rd)+|(th)+/, "");
  return this.zeroPad(dayNum);
};


/**
 * Returns a number as a string with a padded zero if necessary
 */
AzerothConnect.prototype.zeroPad = function (numToPad) {
  return parseInt(numToPad) < 10 ? "0" + numToPad : numToPad;
};
