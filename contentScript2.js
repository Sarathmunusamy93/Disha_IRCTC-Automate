//content script
var clickedEl = null;

var travelDetails = {
  From: "Chennai Egmore - TBM",
  To: "Madurai Jn - MDU",
  Date: "14 Feb, 2023",
  Quota: "General - GN",
};

var callIP = {
  source: "MAS",
  destination: "CGL",
  journeyDate: "20230214",
  jQuota: "GN",
  userToken: "1f0be4c4-24e6-47e0-ae87-f655b04fa612",
  channel: "https://irctc.corover.ai/eticket/#web",
  dSession:
    "V9LEoyKKnWJKzB6EOE+0ndXUZDl71FsezCWWUt+0y9mBVmcAKUbHKoy35wANvV4Hc2sYuwbl02STo9hYy5rduuDcQPZnSbwHN6drCek3fi8aPsFMAlY6/QRgPigz6Y4DylnJzt6jtaX4nxRGhmNnxvdbCVHrFHdDz37pNRoeNpfxecxf5GLzaMWrPtJRwsu7D7QdKSuYYd+lFBx/QtNr6UabiXtNR7E1zKJb9R2MxYeGvltMgayqS7kVUAoYwGNTJ2ecR5ChTd1ilQG7NJA/2Wspslqw58akDCSxU70Cxc/42fCiFLCXAvGtNIoVWUHzCXP5vyJdZdMEqLDtsHw97A==",
  sessionId: "410dbab3-5cb0-4ace-bd80-5c9c5ff62429",
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
};

$(document).ready(function () {
  $.ajax({
    url: "https://irctc.corover.ai/dishaAPI/bot/editTrains",
    dataType: "json",
    method: "post",
    data: { hostname: currentHostname },
    success: function (data) {
      data = JSON.parse(data);
      console.log(data);
    },
  });
});
