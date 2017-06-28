$(document).ready(function () {
  // Configuratiuon object for AzerothConnect
  var config = {
    UUIDselector: 'td[title="UUID"]+td+td>div',
    timestampSelector: 'td[title="@timestamp"]+td+td>div',
    appNameSelector: 'td[title="application"]+td+td>div>mark',
    azerothBaseUrl: 'http://xmldev01.cdlis.co.uk:8090',
    strataAuditPath: '/strataaudit'
  }

  // Create new AzerothConnect object
  var azerothConnect = new AzerothConnect(config);

  // Bind click event to Azeroth query function
  $(document).on('click', config.UUIDselector, function(){
    azerothConnect.query(event);
  });
});
