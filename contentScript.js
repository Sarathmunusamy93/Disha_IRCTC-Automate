//content script
var clickedEl = null;

var travelDetails = {
  From: "MAD",
  To: "SA",
  Month: "March-2023",
  date: "17",
  Quota: "ladies",
};

//general, ladies

//ANG MDU,SA, DLI, FDN

var injectedCode =
  "(" +
  function () {
    setTimeout(function () {
      //  debugger;
      //  searchStation("MAS");
    }, 2000);
  } +
  ")();";

$(document).ready(function () {
  var veryFirstVisit = false;

  setTimeout(function () {
    getAll("localforage", "keyvaluepairs", function (results) {
      if (results[0].recents) {
        results[0].recents.journeys.forEach((element) => {
          element.destination = travelDetails.To;
          element.source = travelDetails.From;
        });

        for (var i = 0; i < results[0].recents.destinations.length; i++) {
          results[0].recents.destinations[i] = travelDetails.To;
          results[0].recents.sources[i] = travelDetails.From;
        }
      } else {
        veryFirstVisit = true;
        results[0].recents = {
          journeys: [
            {
              destination: travelDetails.To,
              source: travelDetails.From,
            },
          ],
          destinations: [travelDetails.To],
          sources: [travelDetails.From],
        };
      }
      // updateData("localforage", "keyvaluepairs", "dishaData");
      del("localforage", "keyvaluepairs", "dishaData", true, function () {
        add(
          "localforage",
          "keyvaluepairs",
          results[0],
          "dishaData",
          false,
          function (result) {
            setTimeout(function () {
              if (veryFirstVisit) window.location.reload();
              selectDate();
            }, 3000);
          }
        );
      });
    });
  }, 3000);

  function selectDate() {
    var calenderSelection = $(
      "img[src$='https://sdk.irctc.corover.ai/askdisha-bucket/calendar-icon-new.png']"
    )[0];

    $(calenderSelection).click();

    setTimeout(function () {
      var targetMonthSection = $("#" + travelDetails.Month + " > .date")[0]
        .lastElementChild;

      $(targetMonthSection.childNodes[0]).attr("id", "targetDate");

      $("#targetDate").click();

      $(
        "img[src$='https://sdk.irctc.corover.ai/askdisha-bucket/calendar-icon-new.png']"
      )[0].parentElement.parentElement.lastChild.click();

      var clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: false,
      });

      $("#" + travelDetails.Quota).click();

      setTimeout(function () {
        simulate($("button")[0], "click");
        setTimeout(function () {
          $(".train-new .tickets .ticket-new")[0].setAttribute(
            "id",
            "targetSlot"
          );

          setTimeout(() => {
            $("#targetSlot").click();
          }, 500);
        }, 5000);
      }, 0);
    }, 1000);
  }
});

function simulate(element, eventName) {
  console.log("Button clicked....");
  var options = extend(defaultOptions, arguments[2] || {});
  var oEvent,
    eventType = null;

  for (var name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name;
      break;
    }
  }

  if (!eventType)
    throw new SyntaxError(
      "Only HTMLEvents and MouseEvents interfaces are supported"
    );

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);
    if (eventType == "HTMLEvents") {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      oEvent.initMouseEvent(
        eventName,
        options.bubbles,
        options.cancelable,
        document.defaultView,
        options.button,
        options.pointerX,
        options.pointerY,
        options.pointerX,
        options.pointerY,
        options.ctrlKey,
        options.altKey,
        options.shiftKey,
        options.metaKey,
        options.button,
        element
      );
    }
    element.dispatchEvent(oEvent);
  } else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    var evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent("on" + eventName, oEvent);
  }
  return element;
}

function extend(destination, source) {
  for (var property in source) destination[property] = source[property];
  return destination;
}

var eventMatchers = {
  HTMLEvents:
    /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
  MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
};
var defaultOptions = {
  pointerX: 0,
  pointerY: 0,
  button: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  bubbles: true,
  cancelable: true,
};

function triggerKey(key, element) {
  if (!/^[a-z]$/.test(key)) return false;
  if (!["INPUT", "TEXTAREA"].includes(element.tagName)) return false;
  const events = ["keydown", "keypress", "textInput", "keyup"];
  events.forEach((event_name) => {
    const opts =
      "textInput" === event_name
        ? {
            inputType: "insertText",
            data: key,
          }
        : {
            key: key,
            code: `Key${key.toUpperCase()}`,
          };
    const event =
      "textInput" === event_name
        ? new InputEvent("input", opts)
        : new KeyboardEvent(event_name, opts);
    element.dispatchEvent(event);
    if ("textInput" === event_name) element.value += key;
  });
  return true;
}
