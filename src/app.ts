import * as firebaseAdmin from "firebase-admin";
import Server from "./infrastructure/server/server";

import dayjs from 'dayjs'
import 'dayjs/locale/es'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isBetween from 'dayjs/plugin/isBetween'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.locale('es')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

/* Este codigo permite realizar console.debug solo en log level = 'debug' */
const debugFunction = console.debug
console.debug = function () {
  if ((process.env.LOG_LEVEL || 'info') === "debug") {
    debugFunction(...arguments)
  }
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_ADMINSDK_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMINSDK_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMINSDK_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ),
  }),
});

declare global {
  interface String {
    toTitleCase(): string;
  }
}

String.prototype.toTitleCase = function (): string {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
  });
};

/* ExpressJS Server */
const server = new Server(process.env.PORT ? parseInt(process.env.PORT) : 3000);

export {server, dayjs}
