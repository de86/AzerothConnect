$(document).ready(function(){
  // Configuration Options:
  // CSS selector of the UUID
  var UUIDselector = 'td[title="UUID"]+td+td>div';

  // CSS selector of the timestamp
  var timestampSelector = 'td[title="@timestamp"]+td+td>div';

  // CSS selector of the app name
  var appNameSelector = 'td[title="application"]+td+td>div>mark';

  // Base URL of Azeroth
  var azerothBaseUrl = "http://xmldev01.cdlis.co.uk:8090"

  // Strata Audit path
  var strataAuditPath = "/strataaudit"

  // Duration of time to query Strata Audit (Should be as small as possible)
  const DURATION = 3;

  // Names of the args used in the Azeroth URL
  const azerothUrlArgs = ["app", "uuid", "date", "hh", "mm", "ss", "duration"];

  // CSS to be injected into the head of the DOM
  var headCss = '<style id="azeroth-connect">\
    ' + UUIDselector + '{\
      color: #33d;\
      text-decoration: underline; }\
    ' + UUIDselector + ':hover {\
      cursor: pointer;\
      color: #119; }\
    ' + UUIDselector + ':active {\
      color: #55f; }';
  
  $('head').append(headCss);


  $(document).on('click', UUIDselector, function(){
    var uuid = this.innerHTML;
    var appName = $(this).closest("tbody").find(appNameSelector).first().html();
    var timestamp = $(this).closest("tbody").find(timestampSelector).first().html();
    var dateAsArray = timestamp.split(/[\s,]+/);

    console.log(appName);

    // [0] = HH, [1] = MM, [2] = SS, [3] = SSV (milliseconds to three decimal points)
    var timeAsArray = dateAsArray.splice(3, 1)[0].split(/:|\./);

    var date = getDate(dateAsArray);

    var azerothQueryUrl = getAzerothUrl([appName, uuid, date, timeAsArray[0], timeAsArray[1], timeAsArray[2], DURATION]);

    window.open(azerothQueryUrl, '_blank');
  });


  // Returns a string of arguments to be passed in the Azeroth URL
  // given an array of values. Arg values must correspond to the
  // azerothURLArgs array
  function getArgsString (urlArgValues) {
    var argsAsString = "?";

    azerothUrlArgs.forEach(function(arg, i) {
      argsAsString += arg +"=" + urlArgValues[i];

      if ( i < (azerothUrlArgs.length -1) ) {
        argsAsString += "&";
      };
    });

    return argsAsString;
  };


  // Returns the full query URL as a string given an array of arg values.
  // Arg values must correspond to the azerothURLArgs array
  function getAzerothUrl (azerothUrlArgs) {
    azerothUrlArgsAsString = getArgsString (azerothUrlArgs);

    return azerothBaseUrl + strataAuditPath + azerothUrlArgsAsString;
  };


  // Returns a date string in the format of "YYYY-MM-DD"
  function getDate (dateAsArray) {
    month = getMonthFromString(dateAsArray[0]);
    day = getDayFromString(dateAsArray[1]);
    year = dateAsArray[2];

    return year + "-" + month + "-" + day;
  };


  // Returns the Month number given a month name
  function getMonthFromString(mon) {
    // Arbitrary day and year used as we are only interested in the Month
    monthNumber = new Date(Date.parse(mon +" 1, 2000")).getMonth() + 1;
    return zeroPad(monthNumber);
  };


  // Returns a day number given a string with number suffix 
  // eg. 1st returns 01
  function getDayFromString(day) {
    // Remove suffix from dates day number as Azeroth needs a clean number 
    var dayNum = day.replace(/(st)+|(nd)+|(rd)+|(th)+/, "");
    return zeroPad(dayNum);
  };


  // Returns a string with a padded zero if necessary
  function zeroPad (numToPad) {
    return parseInt(numToPad) < 10 ? "0" + numToPad : numToPad;
  };
});