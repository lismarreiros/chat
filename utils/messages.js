import moment from "moment"

export function formatMessage(username, text, color) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    color 
  }
}