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