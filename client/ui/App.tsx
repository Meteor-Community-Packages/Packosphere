import React from 'react';
import Header from './components/Header';
import CardGrid from './components/CardGrid';


const headerLinks = [
  { title: "About", url:"" },
  { title: "Packages", url:"" },
  { title: "Projects", url:"" },
  { title: "People", url:"" },
  { title: "Contact", url:"" },
]

const packages = [
  { "_id" : "ZzxYYj25MHCGPyFCx", "packageName" : "00austin:errors", "description" : "A pattern to display application errors to the user" }
  ,{ "_id" : "GTNcXwqBHB6XHTimM", "packageName" : "0x860111:uploadcare", "description" : "Uploadcare library wrapper" }
  ,{ "_id" : "RzSbwXwEDfybM9oNm", "packageName" : "100minus50:log4meteor", "description" : "send your console.log result to server" }
  ,{ "_id" : "DDNks7thATfY9PBdf", "packageName" : "1024kilobyte:winston-logentries", "description" : "A Winston Logentries transport for Meteor." }
  ,{ "_id" : "QtTfhoESHWozwvDAX", "description" : "Latest version of X-Editable for Bootstrap with wysihtml5 rich text editor", "packageName" : "1024kilobyte:x-editable-bootstrap" }
  ,{ "_id" : "poMDHPMj67udcL7n7", "description" : "x-editable in a Blaze template, taking care of reactive updates to x-editable automatically", "packageName" : "1024kilobyte:x-editable-reactive-template" }
  ,{ "_id" : "4TzTmADhh3BRFg7JB", "packageName" : "1497036567:errors", "description" : "A pattern to display application errors to the user" }
  ,{ "_id" : "HhvthqxmjyPq86CQQ", "description" : "[BETA] A wrapper around aldeed:simple-schema that handles error parsing and displays.", "packageName" : "19degrees:gravity" }
  ,{ "_id" : "fyksw4K367HQ3WRiu", "description" : "A server side PayPal package that helps make restful API calls to Paypal.", "packageName" : "19degrees:paypal" }
  ,{ "_id" : "bjq8nmMwCzdpGERaD", "packageName" : "19degrees:paypal-extended-secured", "description" : "A server side PayPal package that helps make restful API calls to Paypal." }
  ,{ "_id" : "3uNatpFPhBZFvjMuZ", "packageName" : "19degrees:scope-permission-demo", "description" : "An in-depth look into scoping and permissions of Meteor." }
  ,{ "_id" : "EL6feKWZ6xmH7QJYu", "packageName" : "19degrees:simple-schema-enforcer", "description" : "Wrapper around aldeed:simple-schema. Enforces schema & allows error handlers to be attached." }
  ,{ "_id" : "t7DaMu3k27cp8Bxew", "packageName" : "19degrees:slack-invite", "description" : "A fork of studiointeract:slack-invite to add loader support." }
  ,{ "_id" : "RiDjXDTurQQGMk3ik", "packageName" : "255kb:cordova-bluetooth-state", "description" : "Reactive bluetooth status for Meteor Cordova apps." }
  ,{ "_id" : "9sY7AgKgtFi3tGKux", "packageName" : "255kb:cordova-disable-select", "description" : "Disables user selection and iOS magnifying glass / longpress menu in Cordova applications." }
  ,{ "_id" : "BRkChiGmxMANCxhXv", "packageName" : "255kb:cordova-keyboard", "description" : "Reactive keyboard status for Meteor Cordova apps." }
  ,{ "_id" : "S2NZSSt5i6KbBMpxN", "packageName" : "255kb:md-snackbars", "description" : "Snackbars and Toasts based on Google's Material Design" }
  ,{ "_id" : "kS7pnbG6RfGB2m7Gw", "packageName" : "255kb:meteor-status", "description" : "Meteor Status automatically alerts users when the connection to the server has been lost." }
  ,{ "_id" : "tvrd3EsrytWRCom5L", "packageName" : "255kb:virtual-scroll", "description" : "Virtual scroller for Blaze" }
  ,{ "_id" : "gqbsGcoQDiM57pf2m", "packageName" : "0x860111:am-ionicons", "description" : "Iconic font, powered by Attribute Modules" }
];

export default () => (
  <>
    <Header links={headerLinks} />
    <section className="flex justify-center bg-gray-200 px-2">
      <div className="container m-auto flex items-center justify-between space-x-5">
        <span className="bg-white rounded-full py-2 px-5 inline-flex items-center w-full md:w-3/5 lg:w-2/5 xl:w-1/3">
          <input type="text" className="bg-transparent outline-none text-yellow-700 flex-grow text-xl placeholder-gray-500" placeholder="Search Packages" />
          <svg className="w-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </span>

          <div className="flex items-center justify-center flex-shrink-0 px-3 py-4 cursor- hover:bg-gray-200">
            <img src="https://ca.slack-edge.com/TNJ4JE5U6-UNHPNU2B1-g4c5d9c8611d-48" className="w-10 h-10 rounded-full ring-2 ring-yellow-600 ring-offset-2 flex-shrink-0" />
            <svg className="ml-2 w-4 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
      </div>
    </section>

    <main className="container mx-auto py-10">
      <CardGrid cardData={packages} />
    </main>
  </>
);
