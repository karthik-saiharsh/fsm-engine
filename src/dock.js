// Contains all the js needed for the dock

$("#pan").click(function () {
  if (currentEditorState == undefined) {
    $("#pan").removeClass("bg-secondary-bg");
    $("#pan").addClass("bg-blue-500");
    currentEditorState = "pan";
  } else if (currentEditorState == "pan") {
    $("#pan").addClass("bg-secondary-bg");
    $("#pan").removeClass("bg-blue-500");
    currentEditorState = undefined;
  } else {
    $(`#${currentEditorState}`).addClass("bg-secondary-bg");
    $(`#${currentEditorState}`).removeClass("bg-blue-500");
    $("#pan").removeClass("bg-secondary-bg");
    $("#pan").addClass("bg-blue-500");
    currentEditorState = "pan";
  }
});

$("#add").click(function () {
  if (currentEditorState == undefined) {
    $("#add").removeClass("bg-secondary-bg");
    $("#add").addClass("bg-blue-500");
    currentEditorState = "add";
  } else if (currentEditorState == "add") {
    $("#add").addClass("bg-secondary-bg");
    $("#add").removeClass("bg-blue-500");
    currentEditorState = undefined;
  } else {
    $(`#${currentEditorState}`).addClass("bg-secondary-bg");
    $(`#${currentEditorState}`).removeClass("bg-blue-500");
    $("#add").removeClass("bg-secondary-bg");
    $("#add").addClass("bg-blue-500");
    currentEditorState = "add";
  }
});

$("#delete").click(function () {
  if (currentEditorState == undefined) {
    $("#delete").removeClass("bg-secondary-bg");
    $("#delete").addClass("bg-blue-500");
    currentEditorState = "delete";
  } else if (currentEditorState == "delete") {
    $("#delete").addClass("bg-secondary-bg");
    $("#delete").removeClass("bg-blue-500");
    currentEditorState = undefined;
  } else {
    $(`#${currentEditorState}`).addClass("bg-secondary-bg");
    $(`#${currentEditorState}`).removeClass("bg-blue-500");
    $("#delete").removeClass("bg-secondary-bg");
    $("#delete").addClass("bg-blue-500");
    currentEditorState = "delete";
  }
});


$("#connect").click(function () {
  if (currentEditorState == undefined) {
    $("#connect").removeClass("bg-secondary-bg");
    $("#connect").addClass("bg-blue-500");
    currentEditorState = "connect";
  } else if (currentEditorState == "connect") {
    $("#connect").addClass("bg-secondary-bg");
    $("#connect").removeClass("bg-blue-500");
    currentEditorState = undefined;
  } else {
    $(`#${currentEditorState}`).addClass("bg-secondary-bg");
    $(`#${currentEditorState}`).removeClass("bg-blue-500");
    $("#connect").removeClass("bg-secondary-bg");
    $("#connect").addClass("bg-blue-500");
    currentEditorState = "connect";
  }
});