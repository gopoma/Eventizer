# Eventizer
**Host:** gopoma

**Description:** Calendar app built with NodeJS, Express, MySQL, EJS.

## Getting Started

First, install all the dependencies of the project with:
```bash
npm install
```

Fill the uncompleted fields in the .env file taking into consideration the .env.example

Run the development server:
```bash
npm run dev
# or
yarn dev
```

## Guide Rope

The project was centered in Validation and Date and File Processing.

### Auth
`middleware verifyNoSession`

**Description:** You could access that routes if you aren't loggedIn yet!, else you are redirected to your profile.

`GET /auth/login => verifyNoSession`

**Description:** Renders the login view.

`POST /auth/login => verifyNoSession`

* All the fields have to be filled.
* Tells you if the email that you entered isn't already registered.
* Enables the session
* 
`middleware addSessionToTemplate`
**Description:** Views can access to the current session.

`GET /auth/signup => verifyNoSession`

**Description:** Renders the signup view

`POST /auth/signup => verifyNoSession`

* If you want to register a new user, you should enter at least your name, username **(unique)**, email **(unique)**, password and password confirmation.
* Your email has to be valid.
* The password and password confirmation have to match.
* Password Encryptation.
* You could send an image as a file.

`GET /auth/logout`

**Description:** Breaks the current session.

### Profile

`middleware verifySession`
**Description:** Protects all routes from users that haven't logged in yet.

`GET /profile/:username`

**Description:** Makes a search through username and renders the profile or 404 (notFound) view.

`GET /profile/update-profile/:username`

**Description:** Makes a search through username and verifies if id is equal to the idUser session data, if validations were successful, renders the form with the current user data, if not, renders 403 (notAllowed) view, if not found, renders 404.

`POST /profile/update-profile/:username`

* If you want to update a user, you have to provide at least name, username **(unique)**, email **(unique)**, oldPassword, newPassword and confirmation.
* oldPassword has to match your current password.
* newPassword and confirmation have to match.
* Your email has to be valid.
* You could send an image as a file too, but it is not required.
* Password Encryptation.
* Once updated, you are automatically logged out.

## Events
**Description:** You have to have a session to access this section.

`GET /events`

**Description:** Renders all Events taking into consideration this data for each event.

```javascript
return {
  ...event,
  date: parseDateString(event.realization),
  isHost: req.session.idUser === event.idHost,
  isEnlisted: guestData.length !== 0,
  host: {
    id: event.idHost,
    name: event.name,
    username: event.username,
    email: event.email,
    profilePic: event.profilePic
  }
}
```

`GET /events/view-details/:idEvent`

**Description:** Renders a single Event and in there you could Enlist you in that Event.

`GET /events/create-event`

**Description:** Renders the Create Event Form.

`POST /events/create-event`

* The Host is assigned taking into consideration your current session.
* You have to enter at least title, description and realization.
* You could add an image as a file, but it is not required.
* You could add guests dinamically, there is validation backwards.

`GET /events/:idEvent/addGuest`

**Description:** With the session and the idEvent param enlists you in an single Event.

`GET /events/update-event/:idEvent`

**Description:** Searchs the Event and validates if the idHost matchs with the current idUser from session and renders the Update Event View filled with the current Event data, else renders 403 and 404 if the Event ins't found.

`POST /events/update-event/:idEvent`

* You have to provide title, description and realization at least.
* You could change the image and submit another one, but it is not required.
* A better implementation could be with the idUser session data.

`GET /events/delete-event/:idEvent`

**Description:** Searchs for the Event and validates that the idHost is equal to the idUser session data and renders the confirmation for deleting the event and the cancel button, else renders 403 or 404 if it isn't exists.

`POST /events/delete-event/:idEvent`

**Description:** Verifies that the Host is deleting his/her event and deletes.