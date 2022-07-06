import React from "react";

function formatDateWithoutTime(dateTime) {
    let fullDate = dateTime.split(" ");
    let date = fullDate[0].split("-");
    let formatedDate = date[1] + "/" + date[2] + "/" + date[0];
    return formatedDate;
}

export default formatDateWithoutTime;